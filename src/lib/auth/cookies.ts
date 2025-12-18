import { cookies } from 'next/headers';

export async function setSessionCookie(sessionId: string, idle_expires: bigint) {
    (await cookies()).set("session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Number(idle_expires)),
    });
}

export async function deleteSessionCookie() {
    (await cookies()).delete("session");
}