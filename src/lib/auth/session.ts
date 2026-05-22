import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_ACTIVE_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_IDLE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string): Promise<{ sessionId: string, idle_expires: bigint }> {
  const sessionId = randomBytes(32).toString("hex");
  const now = Date.now();
  const active_expires = BigInt(now + SESSION_ACTIVE_DURATION);
  const idle_expires = BigInt(now + SESSION_IDLE_DURATION);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      active_expires,
      idle_expires,
    },
  });

  return { sessionId, idle_expires };
}