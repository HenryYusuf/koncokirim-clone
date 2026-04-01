# Design Document: Customer Profile Security Improvements

## 1. Understanding Summary
*   **Purpose**: Strengthening the security of the WhatsApp number verification flow in the Customer Profile feature.
*   **Core Goal**: Prevent account hijacking via phone number manipulation, protect OTP data in the database, and stop brute-force attacks.
*   **Target Users**: KoncoKirim customers updating their profile phone numbers.
*   **Key Constraints**: 6-digit OTP, 5-minute expiration, max 3-5 failed attempts before lockout.
*   **Implementation Areas**: Database Schema, tRPC Router Logic, and Frontend UI.

## 2. Assumptions
1.  Use `SHA-256` for hashing OTP codes before database storage.
2.  Use Node.js native `crypto.randomInt` for cryptographically secure random number generation.
3.  Modification of the Drizzle database schema is permitted.

## 3. Decision Log
1.  **Brute Force Mitigation**: Selected **Hard Lockout** (max 3-5 attempts). OTP is invalidated immediately upon reaching the limit.
2.  **Logical Integrity**: Selected **Pending Phone Field**. Store the target number in `pendingPhoneNumber` during request and verify against it.
3.  **Data Storage**: Selected **SHA-256 Hashing**. OTP codes are never stored in plaintext in the database.
4.  **Cryptography**: Use `crypto.randomInt` instead of `Math.random()`.
5.  **Privacy**: Implement phone number masking in the UI (e.g., `0812****789`).

## 4. Final Design

### A. Database Layer (`auth.ts`)
Add the following fields to the `user` table:
*   `pendingPhoneNumber` (text): Temporary storage for the number being verified.
*   `otpRetryCount` (integer): Counter for failed verification attempts (default 0).
*   `otpCode` (text): Modified to store the SHA-256 hash.

### B. API Layer (`profile.ts`)
**`sendOtp` mutation**:
1. Generate 6-digit code using `crypto.randomInt`.
2. Hash the code using `crypto.createHash('sha256')`.
3. Update `user` table: `otpCode` (hash), `pendingPhoneNumber` (target), `otpRetryCount` (0), and `otpExpiresAt`.
4. Send the *plaintext* code via Evolution API.

**`verifyOtp` mutation**:
1. Compare `input.phoneNumber` with `pendingPhoneNumber` from DB.
2. Compare `hash(input.code)` with `otpCode` hash from DB.
3. If mismatch:
    * Increment `otpRetryCount`.
    * If `otpRetryCount >= 3`, clear all OTP fields (Hard Lockout).
    * Throw error.
4. If match:
    * Update `phoneNumber` with `pendingPhoneNumber`.
    * Clear all OTP fields.

### C. Frontend Layer (`_app.profile.edit.tsx`)
1. Implement a masking helper function for the phone number display.
2. Update the OTP modal to use the masked number.
3. Handle the "Hard Lockout" error by closing the modal and showing a descriptive toast message.

## 5. Verification Strategy
1.  **Unit Test**: Test the hashing and masking helper functions.
2.  **Integration Test**: Attempt to verify OTP with a different phone number than requested (should fail).
3.  **Security Test**: Attempt to brute-force OTP 4 times (should invalidate code on the 3rd or 4th attempt).
