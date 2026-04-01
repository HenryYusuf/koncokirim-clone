# Customer Profile Security Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the security of the WhatsApp number verification flow by fixing logical flaws, preventing brute-force attacks, and improving data protection.

**Architecture:** 
- Database: Add temporary fields for verification state and failure tracking.
- API: Implement cryptographically secure OTP generation, hashing, and strict validation logic.
- UI: Implement privacy-focused phone number masking and enhanced error handling.

**Tech Stack:** Drizzle ORM, tRPC, React (TanStack Router), Node.js Crypto.

---

### Task 1: Database Schema Update

**Files:**
- Modify: `koncokirim-app/packages/db/src/schema/auth.ts`

**Step 1: Write minimal implementation**

Add `pendingPhoneNumber` and `otpRetryCount` to the `user` table.

```typescript
// koncokirim-app/packages/db/src/schema/auth.ts
export const user = sqliteTable("user", {
  // ... existing fields ...
  pendingPhoneNumber: text("pending_phone_number"),
  otpRetryCount: integer("otp_retry_count").default(0).notNull(),
});
```

**Step 2: Commit**

```bash
git add koncokirim-app/packages/db/src/schema/auth.ts
git commit -m "db: add pendingPhoneNumber and otpRetryCount to user schema"
```

---

### Task 2: API Logic - Secure OTP Generation and Hashing

**Files:**
- Modify: `koncokirim-app/packages/api/src/routers/profile.ts`

**Step 1: Write failing test (Conceptual)**
Ensure `sendOtp` uses `crypto.randomInt` and stores a hashed version of the code.

**Step 2: Implement Secure PRNG and Hashing in `sendOtp`**

```typescript
// koncokirim-app/packages/api/src/routers/profile.ts
import crypto from "crypto";

// Inside sendOtp mutation:
// 1. Generate secure 6-digit OTP
const otpCode = crypto.randomInt(100000, 999999).toString();

// 2. Hash the OTP for storage
const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");

// 3. Update database with hash and pending number
await ctx.db
  .update(user)
  .set({ 
    otpCode: hashedOtp, 
    pendingPhoneNumber: waNumber, 
    otpRetryCount: 0,
    otpExpiresAt, 
    otpLastSentAt 
  })
  .where(eq(user.id, ctx.session.user.id));

// 4. Send the PLAINTEXT otpCode to the user
const message = `Kode OTP KoncoKirim anda adalah: *${otpCode}*...`;
```

**Step 3: Commit**

```bash
git add koncokirim-app/packages/api/src/routers/profile.ts
git commit -m "api: use secure PRNG and hashing for OTP generation"
```

---

### Task 3: API Logic - Strict Verification and Hard Lockout

**Files:**
- Modify: `koncokirim-app/packages/api/src/routers/profile.ts`

**Step 1: Implement strict validation in `verifyOtp`**

```typescript
// koncokirim-app/packages/api/src/routers/profile.ts

// Inside verifyOtp mutation:
const hashedInput = crypto.createHash("sha256").update(input.code).digest("hex");

// 1. Check if OTP matches and phone number matches the pending one
if (userData.otpCode !== hashedInput || userData.pendingPhoneNumber !== waNumber) {
  // Increment retry count
  const newRetryCount = (userData.otpRetryCount ?? 0) + 1;
  
  if (newRetryCount >= 3) {
    // Hard Lockout: Invalidate everything
    await ctx.db
      .update(user)
      .set({
        otpCode: null,
        otpExpiresAt: null,
        pendingPhoneNumber: null,
        otpRetryCount: 0,
      })
      .where(eq(user.id, ctx.session.user.id));
      
    throw new TRPCError({ 
      code: "BAD_REQUEST", 
      message: "Terlalu banyak percobaan salah. Kode OTP telah hangus." 
    });
  }

  await ctx.db
    .update(user)
    .set({ otpRetryCount: newRetryCount })
    .where(eq(user.id, ctx.session.user.id));

  throw new TRPCError({ code: "BAD_REQUEST", message: "Kode OTP salah." });
}

// 2. Success: Update main phone number and clear OTP fields
await ctx.db
  .update(user)
  .set({ 
    phoneNumber: waNumber,
    otpCode: null,
    otpExpiresAt: null,
    pendingPhoneNumber: null,
    otpRetryCount: 0,
  })
  .where(eq(user.id, ctx.session.user.id));
```

**Step 2: Commit**

```bash
git add koncokirim-app/packages/api/src/routers/profile.ts
git commit -m "api: implement strict verification and hard lockout for OTP"
```

---

### Task 4: Frontend UI - PII Masking and Lockout Handling

**Files:**
- Modify: `koncokirim-app/apps/web/src/routes/_app.profile.edit.tsx`

**Step 1: Add masking helper**

```typescript
const maskPhoneNumber = (phone: string) => {
  if (phone.length < 7) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-3);
};
```

**Step 2: Update UI to use masked number and handle hard lockout error**

```tsx
// Inside ProfileEditComponent:
// Update display:
<p className="text-sm text-muted-foreground">
  Masukkan 6-digit kode OTP yang kami kirim ke <strong>{maskPhoneNumber(phone)}</strong>
</p>

// Handle specific lockout error in verifyOtpMutation:
const verifyOtpMutation = useMutation(trpc.profile.verifyOtp.mutationOptions({
  onSuccess: () => { /* ... */ },
  onError: (e: any) => {
    toast.error(e.message);
    if (e.message.includes("hangus")) {
      setOtpMode(false); // Close modal on lockout
      setOtpCode("");
    }
  },
}));
```

**Step 3: Commit**

```bash
git add koncokirim-app/apps/web/src/routes/_app.profile.edit.tsx
git commit -m "ui: implement phone number masking and handle OTP lockout"
```
