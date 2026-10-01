"use client";

import {
    Button,
    Field,
    Input,
    NativeSelect,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
    updateEventProposalAction,
    type UpdateEventProposalState,
} from "@/features/command-center/actions/update-event-proposal";
import type { CommandCenterEditableEvent } from "@/features/command-center/types";
import { EventType } from "@/generated/prisma/enums";

type UpdateEventProposalFormProps = {
    coopId: string;
    events: CommandCenterEditableEvent[];
    onBack: () => void;
    onSuccess: () => void;
};

type EventDraft = {
    eventTitle: string;
    eventType: EventType;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    eventDescription: string;
};

const eventTypeLabels: Record<EventType, string> = {
    [EventType.SALES_DAY]: "Sales Day",
    [EventType.MEETING]: "Meeting",
    [EventType.SUPPLY_RUN]: "Supply Run",
    [EventType.PREP_WORK]: "Prep Work",
    [EventType.BOARD_MEETING]: "Board Meeting",
    [EventType.MARKETING_OUTREACH]: "Marketing Outreach",
    [EventType.OTHER]: "Other",
};

const initialState: UpdateEventProposalState = {
    success: false,
    errors: {},
};

const emptyDraft: EventDraft = {
    eventTitle: "",
    eventType: EventType.SALES_DAY,
    eventDate: "",
    startTime: "",
    endTime: "",
    location:"",
    eventDescription:"",
};

const UpdateEventProposalForm = ({
    coopId,
    events,
    onBack,
    onSuccess,
}: UpdateEventProposalFormProps) => {
    const [state, action, pending] = useActionState(
        updateEventProposalAction,
        initialState
    );

    const [selectedEventId, setSelectedEventId] = useState("");
    const [draft, setDraft] = useState<EventDraft>(emptyDraft);

    useEffect(() => {
        if (state.success) {
            onSuccess();
        }
    }, [state.success, onSuccess]);

    const selectedEvent = useMemo(() => {
        return events.find((event) => event.id === selectedEventId) ?? null;
    }, [events, selectedEventId]);

    useEffect(() => {
        if (!selectedEvent) {
            setDraft(emptyDraft);
            return;
        }

        setDraft({
            eventTitle: selectedEvent.title,
            eventType: selectedEvent.type,
            eventDate: selectedEvent.date,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            location: selectedEvent.location ?? "",
            eventDescription: selectedEvent.description ?? "",
        });
    }, [selectedEvent]);

    const updateDraft = <FieldName extends keyof EventDraft>(
        fieldName: FieldName,
        value: EventDraft[FieldName]
    ) => {
        setDraft((currentDraft) => ({
            ...currentDraft,
            [fieldName]: value,
        }));
    };

    if (events.length === 0) {
        return (
            <Stack gap={4}>
                <Text color="gray.600" fontSize="sm">
                    There are no upcoming events to update yet.
                </Text>

                <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    onClick={onBack}
                    alignSelf="start"
                >
                    Back
                </Button>
            </Stack>
        );
    }

    return (
        <form action={action}>
            <Stack gap={4}>
                <input type="hidden" name="coopId" value={coopId} />
                <input type="hidden" name="eventId" value={selectedEventId} />

                {state.errors.general?.[0] && (
                    <Text color="red.600" fontSize="sm">
                        {state.errors.general[0]}
                    </Text>
                )}

                {state.success && (
                    <Text color="green.600" fontSize="sm">
                        Event update proposal created.
                    </Text>
                )}

                <Field.Root invalid={Boolean(state.errors.eventId?.[0])} required>
                    <Field.Label>Event to update</Field.Label>

                    <NativeSelect.Root disabled={pending}>
                        <NativeSelect.Field
                            value={selectedEventId}
                            onChange={(event) => setSelectedEventId(event.currentTarget.value)}
                        >
                            <option value="">Choose an event</option>

                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title} - {event.date} at {event.startTime}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{state.errors.eventId?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventTitle?.[0])} required>
                    <Field.Label>Event title</Field.Label>

                    <Input
                        name="eventTitle"
                        value={draft.eventTitle}
                        onChange={(event) =>
                            updateDraft("eventTitle", event.currentTarget.value)
                        }
                        placeholder="Example: Saturday Lemonade Sale"
                        disabled={pending || !selectedEvent}
                    />

                    <Field.ErrorText>{state.errors.eventTitle?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventType?.[0])} required>
                    <Field.Label>Event type</Field.Label>

                    <NativeSelect.Root disabled={pending || !selectedEvent}>
                        <NativeSelect.Field
                            name="eventType"
                            value={draft.eventType}
                            onChange={(event) =>
                                updateDraft("eventType", event.currentTarget.value as EventType)
                            } 
                        >
                            {Object.values(EventType).map((eventType) => (
                                <option key={eventType} value={eventType}>
                                    {eventTypeLabels[eventType]}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <Field.ErrorText>{state.errors.eventType?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventDate?.[0])} disabled={pending || !selectedEvent} required>
                    <Field.Label>Date</Field.Label>

                    <Input
                        name="eventDate"
                        type="date"
                        value={draft.eventDate}
                        onChange={(event) =>
                            updateDraft("eventDate", event.currentTarget.value)
                        }
                    />

                    <Field.ErrorText>{state.errors.eventDate?.[0]}</Field.ErrorText>
                </Field.Root>

                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                    <Field.Root invalid={Boolean(state.errors.startTime?.[0])} disabled={pending || !selectedEvent} required>
                        <Field.Label>Start time</Field.Label>

                        <Input
                            name="startTime"
                            type="time"
                            value={draft.startTime}
                            onChange={(event) => 
                                updateDraft("startTime", event.currentTarget.value)
                            }
                        />

                        <Field.ErrorText>{state.errors.startTime?.[0]}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={Boolean(state.errors.endTime?.[0])} disabled={pending || !selectedEvent}>
                        <Field.Label>End time</Field.Label>

                        <Input
                            name="endTime"
                            type="time"
                            value={draft.endTime}
                            onChange={(event) =>
                                updateDraft("endTime", event.currentTarget.value)
                            }
                        />

                        <Field.ErrorText>{state.errors.endTime?.[0]}</Field.ErrorText>
                    </Field.Root>
                </Stack>

                <Field.Root invalid={Boolean(state.errors.location?.[0])} disabled={pending || !selectedEvent}>
                    <Field.Label>Location</Field.Label>

                    <Input
                        name="location"
                        value={draft.location}
                        onChange={(event) =>
                            updateDraft("location", event.currentTarget.value)
                        }
                        placeholder="Example: Main Street Park"
                    />

                    <Field.ErrorText>{state.errors.location?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventDescription?.[0])} disabled={pending || !selectedEvent}>
                    <Field.Label>Description</Field.Label>

                    <Textarea
                        name="eventDescription"
                        value={draft.eventDescription}
                        onChange={(event) =>
                            updateDraft("eventDescription", event.currentTarget.value)
                        }
                        placeholder="Describe what will happen at this event."
                        rows={3}
                    />

                    <Field.ErrorText>
                        {state.errors.eventDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label>Why should this event be updated?</Field.Label>

                    <Textarea
                        name="reason"
                        placeholder="Example: We need to move the sale earlier because it gets hot in the afternoon."
                        rows={3}
                    />

                    <Field.ErrorText>{state.errors.reason?.[0]}</Field.ErrorText>
                </Field.Root>

                <Stack direction="row" justify="space-between" gap={3}>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={onBack}
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        colorPalette="yellow"
                        loading={pending}
                        disabled={!selectedEvent}
                    >
                        Propose Event Update
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export { UpdateEventProposalForm }