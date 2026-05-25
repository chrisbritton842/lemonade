"use server";

import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth/cookies";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { homePagePath } from "@/paths";

export type SignInState = {
    success: boolean;
    userId?: string;
    errors: {
        username?: string[];
        password?: string[];
        general?: string[];
    };
};

const schema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const signInAction = async (_prevState: SignInState, formData: FormData): Promise<SignInState> => {
    const parsed = schema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });
    
    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        return { success: false, errors };
    };

    const { username, password } = parsed.data;
    
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                key: true,
            },
        });

        if (!user) {
            return {
                success: false,
                errors: { general: ["Invalid username or password"] },
            };
        }

        const passwordKey = user.key.find((key) =>
            key.id.startsWith("password:")
        );

        if (!passwordKey?.passwordHash) {
            return {
                success: false,
                errors: { general: ["Invalid username or password"] },
            };
        }

        const validPassword = await verify(passwordKey.passwordHash, password);

        if (!validPassword) {
            return {
                success: false,
                errors: { general: ["Invalid username or password"] },
            };
        }

        const { sessionId, idle_expires } = await createSession(user.id);

        await setSessionCookie(sessionId, idle_expires);
    } catch (error) {
        console.error("SIGNIN ERROR:", error);
        return {
            success: false,
            errors: { general: ["An unexpected error occurred. Please try again."] },
        };
    }
    
    redirect(homePagePath());
};

