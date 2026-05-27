import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: {
            id: sessionCookie.value,
        },
        include: {
            user: true,
        },
    });

    if (!session) {
        return null;
    }

    const now = Date.now();

    if (
        Number(session.idle_expires) < now ||
        Number(session.active_expires) < now
    ) {
        return null;
    }

    return {
        user: session.user,
        session,
    };
}