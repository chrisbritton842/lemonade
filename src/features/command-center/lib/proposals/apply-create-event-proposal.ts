import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
    EventStatus,
    EventType,
} from "@/generated/prisma/enums";

type TransactionClient = Prisma.TransactionClient;

const TIME_ZONE = "America/Los_Angeles";

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

const createEventPayloadSchema = z
    .object({
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
        if (!data.endTime) {
            return;
        }

        if (data.endTime <= data.startTime) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after start time.",
            });
        }
    });

type CreateEventProposal = {
    id: string;
    coopId: string;
    createdById: string;
    payload: Prisma.JsonValue | null;
    appliedAt: Date | null;
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

    const valueByType = new Map(
        parts.map((part) => [part.type, part.value])
    );

    const year = Number(valueByType.get("year"));
    const month = Number(valueByType.get("month"));
    const day = Number(valueByType.get("day"));
    const hour = Number(valueByType.get("hour"));
    const minute = Number(valueByType.get("minute"));
    const second = Number(valueByType.get("second"));

    const zonedTimeAsUtc = Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        second
    );

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

    const utcGuess = new Date(
        Date.UTC(year, month - 1, day, hour, minute, 0)
    );

    let offset = getTimeZoneOffsetMs(utcGuess, timeZone);
    let result = new Date(utcGuess.getTime() - offset);

    offset = getTimeZoneOffsetMs(result, timeZone);
    result = new Date(utcGuess.getTime() - offset);

    return result;
};

const applyCreateEventProposal = async ({
    tx,
    proposal,
}: {
    tx: TransactionClient;
    proposal: CreateEventProposal;
}) => {
    if (proposal.appliedAt) {
        return;
    }

    const existingEvent = await tx.event.findUnique({
        where: {
            sourceProposalId: proposal.id,
        },
    });

    if (existingEvent) {
        await tx.proposal.update({
            where: {
                id: proposal.id,
            },
            data: {
                appliedAt: new Date(),
            },
        });

        return;
    }

    const payload = createEventPayloadSchema.parse(proposal.payload);

    const startsAt = createDateTimeInTimeZone({
        date: payload.eventDate,
        time: payload.startTime,
        timeZone: TIME_ZONE,
    });

    const endsAt = payload.endTime
        ? createDateTimeInTimeZone({
            date: payload.eventDate,
            time: payload.endTime,
            timeZone: TIME_ZONE,
        })
        : null;

    await tx.event.create({
        data: {
            coopId: proposal.coopId,
            createdById: proposal.createdById,
            title: payload.eventTitle,
            description: payload.eventDescription || null,
            location: payload.location || null,
            type: payload.eventType,
            status: EventStatus.CONFIRMED,
            startsAt,
            endsAt,
            sourceProposalId: proposal.id,
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

export { applyCreateEventProposal };
