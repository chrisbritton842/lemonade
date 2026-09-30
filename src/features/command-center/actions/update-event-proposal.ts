"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
    EventStatus,
    EventType,
    ProposalStatus,
    ProposalThreshold,
    ProposalType,
    VoteChoice,
} from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath, signInPagePath } from "@/paths";

export type UpdateEventProposalState = {
    success: boolean;
    errors: {
        eventId?: string[];
        eventTitle?: string[];
        eventType?: string[];
        eventDate?: string[];
        startTime?: string[];
        endTime?: string[];
        location?: string[];
        eventDescription?: string[];
        reason?: string[];
        general?: string[];
    };
};

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const isValidDateOnly = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

const updateEventProposalSchema = z
    .object({
        coopId: z.string().min(1),
        eventId: z.string().min(1, "Choose an event to pupdate."),
        eventTitle: z
            .string()
            .trim()
            .min(2, "Event title must be at least 2 characters.")
            .max(80, "Event title must be 80 characters or less."),
        eventType: z.nativeEnum(EventType),
        eventDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
            .refine(isValidDateOnly, "Choose a valid date."),
        startTime: z.string().regex(timeRegex, "Choose a valid start time."),
        endTime: z.string().regex(timeRegex, "Choose a valid end time.").optional(),
        location: z
            .string()
            .trim()
            .max(120, "Location must be 120 characters or less.")
            .optional(),
        eventDescription: z
            .string()
            .trim()
            .max(500, "Description must be 500 characters or less.")
            .optional(),
        reason: z
            .string()
            .trim()
            .max(300, "Reason must be 300 characters or less.")
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.endTime && data.endTime ,+ data.startTime) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after the start time.",
            });
        }
    });

const updateEventProposalAction = async (
    _previousState: UpdateEventProposalState,
    formData: FormData
): Promise<UpdateEventProposalState> => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect(signInPagePath());
    }

    const parsed = updateEventProposalSchema.safeParse({
        coopId: formData.get("coopId"),
        eventId: formData.get("eventId"),
        eventTitle: formData.get("eventTitle"),
        eventType: formData.get("eventType"),
        eventDate: formData.get("eventDate"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime") || undefined,
        location: formData.get("location") || undefined,
        eventDescription: formData.get("eventDescription") || undefined,
        reason: formData.get("reason") || undefined,
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        coopId,
        eventId,
        eventTitle,
        eventType,
        eventDate,
        startTime,
        endTime,
        location,
        eventDescription,
        reason,
    } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_coopId: {
                userId: currentUser.user.id,
                coopId,
            },
        },
        select: {
            id: true,
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

    const existingEvent = await prisma.event.findFirst({
        where: {
            id: eventId,
            coopId,
            status: {
                not: EventStatus.CANCELLED,
            },
        },
        select: {
            id: true,
            title: true,
        },
    });

    if (!existingEvent) {
        return {
            success: false,
            errors: {
                eventId: ["Choose a valid event from this business."],
            },
        };
    }

    await prisma.proposal.create({
        data: {
            coopId,
            createdById: currentUser.user.id,
            title: `Update event: ${existingEvent.title}`,
            description:
                reason ||
                `Update "${existingEvent.title}" to "${eventTitle}".`,
            type: ProposalType.UPDATE_EVENT,
            status: ProposalStatus.OPEN,
            threshold: ProposalThreshold.SIMPLE_MAJORITY,
            payload: {
                eventId,
                eventTitle,
                eventDescription: eventDescription || null,
                eventType,
                eventDate,
                startTime,
                endTime: endTime || null,
                location: location || null,
            },
            votes: {
                create: {
                    userId: currentUser.user.id,
                    choice: VoteChoice.YES,
                },
            },
        },
    });

    revalidatePath(commandCenterPagePath(coopId));

    return {
        success: true,
        errors: {},
    };
};

export { updateEventProposalAction };