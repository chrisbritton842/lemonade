"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskStatus } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

const takeTaskAction = async (formData: FormData): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const taskId = String(formData.get("taskId") ?? "");
    const coopId = String(formData.get("coopId") ?? "");

    if (!taskId || !coopId) {
        throw new Error("Missing task information.");
    }

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId,
            },
        },
    });

    if (!membership) {
        throw new Error("You are not a member of this cooperative.");
    }

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            coopId,
            status: TaskStatus.AVAILABLE,
            assignedToId: null,
        },
    });

    if (!task) {
        throw new Error("This task is no longer available.");
    }

    await prisma.task.update({
        where: {
            id: task.id,
        },
        data: {
            assignedToId: user.user.id,
            status: TaskStatus.ASSIGNED,
        },
    });

    revalidatePath(commandCenterPagePath(coopId));
};

export { takeTaskAction };