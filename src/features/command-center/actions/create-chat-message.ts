"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

const schema = z.object({
    coopId: z.string().min(1),
    content: z
        .string()
        .trim()
        .min(1, "Write a message first.")
        .max(300, "Messages must be 300 characters or less."),
});

const createChatMessageAction = async (formData: FormData): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        content: formData.get("content"),
    });

    if (!parsed.success) {
        throw new Error("Invalid message.");
    }

    const { coopId, content } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId,
            },
        },
    });

    if (!membership) {
        throw new Error("You do not work for this business.");
    }

    await prisma.chatMessage.create({
        data: {
            coopId,
            authorId: user.user.id,
            content,
        },
    });

    revalidatePath(commandCenterPagePath(coopId));
};

export { createChatMessageAction };