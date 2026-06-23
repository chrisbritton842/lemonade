"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskStatus } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { signInPagePath } from "@/paths";

const submitTaskForReviewAction = async (formData: FormData): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const taskId = String(formData.get("taskId") ?? "");
    const coopId = String(formData.get("coopId") ?? "");

    if (!taskId || !coopId) {
        throw new Error("Missing task information.");
    }

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            coopId,
            assignedToId: user.user.id,
            status: TaskStatus.ASSIGNED,
        },
    });

    if (!task) {
        throw new Error("Task not found or cannot be submitted.");
    }

    await prisma.task.update({
        where: {
            id: task.id,
        },
        data: {
            status: TaskStatus.NEEDS_REVIEW,
            submittedAt: new Date(),
        },
    });

    revalidatePath(`/cooperative/${coopId}/command-center`);
};

export { submitTaskForReviewAction };