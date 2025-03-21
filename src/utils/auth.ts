import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  return sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateCSRFToken(): string {
  return sign({ type: "csrf" }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyCSRFToken(token: string): boolean {
  try {
    const decoded = verifyToken(token);
    return decoded?.type === "csrf";
  } catch (error) {
    return false;
  }
}
