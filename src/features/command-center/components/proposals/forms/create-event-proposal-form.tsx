"use client";

import {
    Button,
    Field,
    HStack,
    Input,
    NativeSelect,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import {
    createEventProposalAction,
    type CreateEventProposalState,
} from "@/features/command-center/actions/create-event-proposal";

type CreateEventProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateEventProposalState = {
    success: false,
    errors: {},
};

const CreateEventProposalForm = ({
    coopId,
    onBack,
    onSuccess,
}: CreateEventProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createEventProposalAction,
        initialState
    );

    useEffect(() => {
        if (state.success) {
            onSuccess();
        }
    }, [state.success, onSuccess]);

    return (
        <form action={action}>
            <Stack gap={5}>
                {state.errors.general?.[0] && (
                    <Text color="red.600" fontSize="sm">
                        {state.errors.general[0]}
                    </Text>
                )}

                <input type="hidden" name="coopId" value={coopId} />

                <Field.Root invalid={Boolean(state.errors.eventTitle?.[0])} required>
                    <Field.Label>Event Title</Field.Label>
                    <Input
                        name="eventTitle"
                        placeholder="Lemonade sale at soccer game"
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.eventTitle?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventType?.[0])} required>
                    <Field.Label>Event Type</Field.Label>

                    <NativeSelect.Root disabled={pending}>
                        <NativeSelect.Field name="eventType" defaultValue="">
                            <option value="" disabled>
                                Choose an event type
                            </option>
                            <option value="SALES_DAY">Sales Day</option>
                            <option value="MEETING">Meeting</option>
                            <option value="SUPPLY_RUN">Supply Run</option>
                            <option value="PREP_WORK">Prep Work</option>
                            <option value="BOARD_MEETING">Board Meeting</option>
                            <option value="MARKETING_OUTREACH">Marketing/Outreach</option>
                            <option value="OTHER">Other</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <Field.ErrorText>{state.errors.eventType?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventDate?.[0])} required>
                    <Field.Label>Date</Field.Label>
                    <Input name="eventDate" type="date" disabled={pending} />
                    <Field.ErrorText>{state.errors.eventDate?.[0]}</Field.ErrorText>
                </Field.Root>

                <HStack gap={3} align="start">
                    <Field.Root invalid={Boolean(state.errors.startTime?.[0])} required>
                        <Field.Label>Start Time</Field.Label>
                        <Input name="startTime" type="time" disabled={pending} />
                        <Field.ErrorText>{state.errors.startTime?.[0]}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={Boolean(state.errors.endTime?.[0])}>
                        <Field.Label>End Time</Field.Label>
                        <Input name="endTime" type="time" disabled={pending} />
                        <Field.ErrorText>{state.errors.endTime?.[0]}</Field.ErrorText>
                    </Field.Root>
                </HStack>

                <Field.Root invalid={Boolean(state.errors.location?.[0])}>
                    <Field.Label>Location</Field.Label>
                    <Input
                        name="location"
                        placeholder="Spring Lake Park"
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.location?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.eventDescription?.[0])}>
                    <Field.Label>Event Description</Field.Label>
                    <Textarea
                        name="eventDescription"
                        placeholder="Describe what will happen at this event."
                        rows={3}
                        disabled={pending}
                    />
                    <Field.ErrorText>
                        {state.errors.eventDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label>Reason</Field.Label>
                    <Textarea
                        name="reason"
                        placeholder="Explain why this event would help the business."
                        rows={3}
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.reason?.[0]}</Field.ErrorText>
                </Field.Root>

                <HStack justify="space-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={pending}
                    >
                        Back
                    </Button>

                    <Button type="submit" colorPalette="yellow" loading={pending}>
                        Create Proposal
                    </Button>
                </HStack>
            </Stack>
        </form>
    );
};

export { CreateEventProposalForm };