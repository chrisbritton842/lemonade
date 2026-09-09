"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    EventType,
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

export type CreateEventProposalState ={
    success: boolean;
    errors: {
        eventTitle?: string[];
        eventDescription?: string[];
        eventType?: string[];
        eventDate?: string[];
        startTime?: string[];
        endTime?: string[];
        location?: string[];
        reason?: string[];
        general?: string[];
    };
};

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const isValidDateOnly = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return false;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

const schema = z
    .object({
        coopId: z.string().min(1),
        eventTitle: z
            .string()
            .trim()
            .min(2, "Event title must be at least 2 characters.")
            .max(80, "Event title must be 80 characters or less."),
        eventDescription: z
            .string()
            .trim()
            .max(500, "Description must be 500 characters or less.")
            .optional(),
        eventType: z
            .string()
            .min(1, "Choose an event type.")
            .pipe(z.nativeEnum(EventType)),
        eventDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
            .refine(isValidDateOnly, "Choose a valid date."),
        startTime: z
            .string()
            .regex(timeRegex, "Choose a valid start time."),
        endTime: z
            .string()
            .optional()
            .transform((value) => (value === "" ? undefined : value))
            .pipe(
                z
                    .string()
                    .regex(timeRegex, "Choose a valid end time.")
                    .optional()
            ),
        location: z
            .string()
            .trim()
            .max(120, "Location must be 120 characters or less.")
            .optional(),
        reason: z
            .string()
            .trim()
            .max(500, "Reason must be 500 characters or less.")
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.endTime) {
            return;
        }

        if (data.endTime <= data.startTime) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after the start time.",
            });
        }
    });

const createEventProposalAction = async (
    _prevState: CreateEventProposalState,
    formData: FormData
): Promise<CreateEventProposalState> => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        coopId: formData.get("coopId"),
        eventTitle: formData.get("eventTitle"),
        eventDescription: formData.get("eventDescription"),
        eventType: formData.get("eventType"),
        eventDate: formData.get("eventDate"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        location: formData.get("location"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        coopId,
        eventTitle,
        eventDescription,
        eventType,
        eventDate,
        startTime,
        endTime,
        location,
        reason,
    } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: user.user.id,
                coopId,
            },
        },
    });

    if (!membership) {
        return {
            success: false,
            errors: {
                general: ["You do not work for this business."],
            },
        };
    }

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: user.user.id,
            title: `Create event: ${eventTitle}`,
            description:
                reason ||
                eventDescription ||
                "A member proposed creating a new event.",
            type: ProposalType.CREATE_EVENT,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            payload: {
                eventTitle,
                eventDescription: eventDescription || null,
                eventType,
                eventDate,
                startTime,
                endTime: endTime || null,
                location: location || null,
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { createEventProposalAction };