"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSessionCookie } from "@/lib/auth/cookies";
import { prisma } from "@/lib/prisma";
import { signInPagePath } from "@/paths";

const signOutAction = async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
        await prisma.session.deleteMany({
            where: {
                id: sessionId,
            },
        });
    }

    await deleteSessionCookie();

    redirect(signInPagePath());
};

export { signOutAction };