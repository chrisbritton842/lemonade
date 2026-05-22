"use server";

import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth/cookies";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { homePagePath } from "@/paths";

export type SignUpState = {
  success: boolean;
  userId?: string;
  errors: {
    username?: string[];
    password?: string[];
    general?: string[];
  };
};

const schema = z.object({
    username: z
        .string()
        .min(3)
        .max(20)
        .refine(
            (value) => !value.includes(" "),
            "Username cannot contain spaces"
        ),
    password: z.string().min(6).max(100),
});

export  const signUpAction = async (_prevState: SignUpState, formData: FormData) => {
    console.log("SIGNUP ACTION HIT");

    const parsed = schema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    console.log("parsed success:", parsed.success);

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        return { success: false, errors };
    }

    const { username, password } = parsed.data;

    try {
        const passwordHash = await hash(password, {
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 1,
        });

        console.log("Password hashed successfully for username:", username);

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    username,
                    displayName: username,
                },
            });

            console.log("New user created:", newUser);

            await tx.key.create({
                data: {
                    id: `password:${newUser.id}`,
                    userId: newUser.id,
                    passwordHash,
                },
            });

            console.log("Password key created for user:", newUser.id);

            return newUser;
        });

        const { sessionId, idle_expires } = await createSession(user.id);

        await setSessionCookie(sessionId, idle_expires);

    } catch (error: any) {
        if (error.code === "P2002") {
            return {
                success: false,
                errors: {
                    username: ["Username is already taken"],
                },
            };
        }

        return { success: false, errors: { general: ["An error occurred during sign up"] } };
    }

    redirect(homePagePath())
}

