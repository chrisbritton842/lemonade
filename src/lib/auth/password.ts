import { Argon2id } from "oslo/password";

const argon2 = new Argon2id();

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await argon2.verify(hash, password);
}