import { describe, expect, it } from "bun:test";
import { signUpSchema } from "./auth-validation";

describe("Sign Up Validation", () => {
  it("should validate a correct Indonesian phone number starting with 08", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "0812345678",
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should validate a correct Indonesian phone number starting with +628", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "+62812345678",
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should fail if phone number is less than 10 digits", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "081234567", // 9 digits
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should fail if phone number does not start with 08 or +628", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "0212345678",
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should fail if phone number contains non-digits after prefix", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "08123abc78",
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should fail if phone number is too long (more than 16 characters for +628)", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phoneNumber: "+6281234567890123", // Too long
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
