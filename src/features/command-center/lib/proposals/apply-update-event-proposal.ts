import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { EventStatus, EventType } from "@/generated/prisma/enums";

type TransactionClient = Prisma.TransactionClient;

const TIME_ZONE = "America/Los_Angeles";

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

const getTimeZoneOffsetMs = (date: Date, timeZone: string) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });
    
    const parts = formatter.formatToParts(date);
    const valueByType = new Map(parts.map((part) => [part.type, part.value]));

    const year = Number(valueByType.get("year"));
    const month = Number(valueByType.get("month"));
    const day = Number(valueByType.get("day"));
    const hour = Number(valueByType.get("hour"));
    const minute = Number(valueByType.get("minute"));
    const second = Number(valueByType.get("second"));

    const zonedTimeAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

    return zonedTimeAsUtc - date.getTime();
};

const createDateTimeInTimeZone = ({
    date,
    time,
    timeZone,
}: {
    date: string;
    time: string;
    timeZone: string;
}) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

    let offset = getTimeZoneOffsetMs(utcGuess, timeZone);
    let result = new Date(utcGuess.getTime() - offset);

    offset = getTimeZoneOffsetMs(result, timeZone);
    result = new Date(utcGuess.getTime() - offset);

    return result;
};

const updateEventPayloadSchema = z
    .object({
        eventId: z.string().min(1),
        eventTitle: z.string().trim().min(2).max(80),
        eventDescription: z.string().trim().max(500).nullable().optional(),
        eventType: z.nativeEnum(EventType),
        eventDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .refine(isValidDateOnly),
        startTime: z.string().regex(timeRegex),
        endTime: z.string().regex(timeRegex).nullable().optional(),
        location: z.string().trim().max(120).nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.endTime && data.endTime <= data.startTime) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after the start time.",
            });
        }
    });

type UpdateEventProposal = {
    id: string;
    coopId: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
};

type ApplyUpdateEventProposalInput = {
    tx: TransactionClient;
    proposal: UpdateEventProposal;
};

const applyUpdateEventProposal = async ({
    tx,
    proposal,
}: ApplyUpdateEventProposalInput) => {
    if (proposal.appliedAt) {
        return;
    }

    const parsed = updateEventPayloadSchema.safeParse(proposal.payload);

    if (!parsed.success) {
        throw new Error("Invalid update event proposal payload.");
    }

    const {
        eventId,
        eventTitle,
        eventDescription,
        eventType,
        eventDate,
        startTime,
        endTime,
        location,
    } = parsed.data;

    const existingEvent = await tx.event.findFirst({
        where: {
            id: eventId,
            coopId: proposal.coopId,
            status: {
                not: EventStatus.CANCELLED,
            },
        },
        select: {
            id: true,
        },
    });

    if (!existingEvent) {
        throw new Error("Cannot update an event that does not belong to this business.");
    }

    const startsAt = createDateTimeInTimeZone({
        date: eventDate,
        time: startTime,
        timeZone: TIME_ZONE,
    });

    const endsAt = endTime
        ? createDateTimeInTimeZone({
              date: eventDate,
              time: endTime,
              timeZone: TIME_ZONE,
          })
        : null;

    await tx.event.update({
        where: {
            id: existingEvent.id,
        },
        data: {
            title: eventTitle,
            description: eventDescription || null,
            type: eventType,
            startsAt,
            endsAt,
            location: location || null,
        },
    });

    await tx.proposal.update({
        where: {
            id: proposal.id,
        },
        data: {
            appliedAt: new Date(),
        },
    });
};

export { applyUpdateEventProposal };
