import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { schema } from "@koncokirim-app/db";
const { user, addresses } = schema;
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";


import crypto from "crypto";
import { env } from "@koncokirim-app/env/server";

const formatWhatsAppNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return cleaned;
};

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [userData] = await ctx.db
      .select()
      .from(user)
      .where(eq(user.id, ctx.session.user.id));
    return userData;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          ...(input.name && { name: input.name }),
        })
        .where(eq(user.id, ctx.session.user.id));
      return { success: true };
    }),

  sendOtp: protectedProcedure
    .input(z.object({ phoneNumber: z.string().min(9) }))
    .mutation(async ({ ctx, input }) => {
      const waNumber = formatWhatsAppNumber(input.phoneNumber);

      const [currentUser] = await ctx.db
        .select()
        .from(user)
        .where(eq(user.id, ctx.session.user.id));

      if (currentUser?.otpLastSentAt) {
        const cooldownMs = 60 * 1000;
        const timeSinceLast = Date.now() - currentUser.otpLastSentAt.getTime();
        if (timeSinceLast < cooldownMs) {
          const remaining = Math.ceil((cooldownMs - timeSinceLast) / 1000);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Tunggu ${remaining} detik lagi untuk mengirim ulang OTP.`,
          });
        }
      }

      // Generate secure 6-digit OTP
      const otpCode = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      const otpLastSentAt = new Date();

      // Hash the OTP for storage
      const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");

      // Save to user
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

      // Send via Evolution API
      const message = `Kode OTP KoncoKirim anda adalah: *${otpCode}*. Berlaku selama 5 menit. Jangan berikan kode ini ke siapapun.`;
      
      try {
        const response = await fetch(
          `${env.EVOLUTION_API_URL}/message/sendText/${env.EVOLUTION_INSTANCE_NAME}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: env.EVOLUTION_API_KEY,
            },
            body: JSON.stringify({
              number: waNumber,
              text: message,
            }),
          }
        );
        
        if (!response.ok) {
          // Log only the status for security (PII Leak Fix)
          console.error("Evolution API failed with status", response.status);
          throw new Error(`Evolution API failed with status ${response.status}`);
        }
      } catch (e: any) {
        console.error("Evolution API Send OTP Error");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Gagal mengirim OTP. Silakan coba beberapa saat lagi.`,
        });
      }

      return { success: true };
    }),

  verifyOtp: protectedProcedure
    .input(z.object({ phoneNumber: z.string().min(9), code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const waNumber = formatWhatsAppNumber(input.phoneNumber);

      const [userData] = await ctx.db
        .select()
        .from(user)
        .where(eq(user.id, ctx.session.user.id));

      if (!userData || !userData.otpCode || !userData.otpExpiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "OTP belum direquest." });
      }

      if (new Date() > userData.otpExpiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Kode OTP kadaluarsa." });
      }

      const hashedInputCode = crypto.createHash("sha256").update(input.code).digest("hex");
      const isPhoneMatch = userData.pendingPhoneNumber === waNumber;
      const isCodeMatch = userData.otpCode === hashedInputCode;

      if (!isPhoneMatch || !isCodeMatch) {
        const newRetryCount = userData.otpRetryCount + 1;

        if (newRetryCount >= 3) {
          // Lockout: clear all OTP fields
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
            message: "Terlalu banyak percobaan salah. Silakan request OTP baru.",
          });
        }

        // Increment retry count
        await ctx.db
          .update(user)
          .set({ otpRetryCount: newRetryCount })
          .where(eq(user.id, ctx.session.user.id));

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: !isPhoneMatch ? "Nomor telepon tidak sesuai." : "Kode OTP salah.",
        });
      }

      // Valid, update phone number and clear OTP
      await ctx.db
        .update(user)
        .set({ 
          phoneNumber: userData.pendingPhoneNumber!,
          otpCode: null,
          otpExpiresAt: null,
          pendingPhoneNumber: null,
          otpRetryCount: 0,
        })
        .where(eq(user.id, ctx.session.user.id));

      return { success: true };
    }),

  getAddresses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, ctx.session.user.id));
  }),

  addAddress: protectedProcedure
    .input(
      z.object({
        label: z.string().min(1),
        fullAddress: z.string().min(1),
        receiverName: z.string().min(1),
        receiverPhone: z.string().min(1),
        isDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingAddresses = await ctx.db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, ctx.session.user.id));

      if (existingAddresses.length >= 3) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Maksimal 3 alamat diperbolehkan.",
        });
      }

      // If set as default, unset others first
      if (input.isDefault) {
        await ctx.db
          .update(addresses)
          .set({ isDefault: false })
          .where(eq(addresses.userId, ctx.session.user.id));
      }

      await ctx.db.insert(addresses).values({
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        label: input.label,
        fullAddress: input.fullAddress,
        receiverName: input.receiverName,
        receiverPhone: input.receiverPhone,
        isDefault: input.isDefault || existingAddresses.length === 0, // Default if first address
      });

      return { success: true };
    }),

  deleteAddress: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure user owns the address
      const [address] = await ctx.db
        .select()
        .from(addresses)
        .where(
          and(eq(addresses.id, input.id), eq(addresses.userId, ctx.session.user.id))
        );

      if (!address) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Alamat tidak ditemukan." });
      }

      await ctx.db.delete(addresses).where(eq(addresses.id, input.id));

      // If deleted address was default, set another one as default
      if (address.isDefault) {
        const [nextAddress] = await ctx.db
          .select()
          .from(addresses)
          .where(eq(addresses.userId, ctx.session.user.id))
          .limit(1);

        if (nextAddress) {
          await ctx.db
            .update(addresses)
            .set({ isDefault: true })
            .where(eq(addresses.id, nextAddress.id));
        }
      }

      return { success: true };
    }),

  setDefaultAddress: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure user owns the address
      const [address] = await ctx.db
        .select()
        .from(addresses)
        .where(
          and(eq(addresses.id, input.id), eq(addresses.userId, ctx.session.user.id))
        );

      if (!address) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Alamat tidak ditemukan." });
      }

      // Unset previous default
      await ctx.db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, ctx.session.user.id));

      // Set new default
      await ctx.db
        .update(addresses)
        .set({ isDefault: true })
        .where(eq(addresses.id, input.id));

      return { success: true };
    }),
});
