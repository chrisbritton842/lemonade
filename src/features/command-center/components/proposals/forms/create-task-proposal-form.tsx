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
    createTaskProposalAction,
    type CreateTaskProposalState,
} from "@/features/command-center/actions/create-task-proposal";

type CreateTaskProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateTaskProposalState = {
    success: false,
    errors: {},
};

const CreateTaskProposalForm = ({
    coopId,
    onBack,
    onSuccess,
}: CreateTaskProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createTaskProposalAction,
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

                <Field.Root invalid={Boolean(state.errors.taskTitle?.[0])} required>
                    <Field.Label>Task Title</Field.Label>
                    <Input
                        name="taskTitle"
                        placeholder="Buy lemons"
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.taskTitle?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.taskDescription?.[0])}>
                    <Field.Label>Task Description</Field.Label>
                    <Textarea
                        name="taskDescription"
                        placeholder="Describe what the member should do."
                        disabled={pending}
                        rows={3}
                    />
                    <Field.ErrorText>
                        {state.errors.taskDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.role?.[0])}>
                    <Field.Label>Role</Field.Label>

                    <NativeSelect.Root disabled={pending}>
                        <NativeSelect.Field name="role">
                            <option value="">General task</option>
                            <option value="BOARD_OF_DIRECTORS">Board of Directors</option>
                            <option value="PRODUCTION">Production</option>
                            <option value="CUSTOMER_SERVICE">Customer Service</option>
                            <option value="INVENTORY">Inventory</option>
                            <option value="MARKETING">Marketing</option>
                            <option value="ACCOUNTING">Accounting</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <Field.ErrorText>{state.errors.role?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.points?.[0])} required>
                    <Field.Label>Points</Field.Label>
                    <Input
                        name="points"
                        type="number"
                        min={1}
                        max={3}
                        defaultValue={1}
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.points?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.dueDate?.[0])}>
                    <Field.Label>Due Date</Field.Label>
                    <Input name="dueDate" type="date" disabled={pending} />
                    <Field.ErrorText>{state.errors.dueDate?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label>Reason</Field.Label>
                    <Textarea
                        name="reason"
                        placeholder="Explain why this task is necessary."
                        disabled={pending}
                        rows={3}
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

export { CreateTaskProposalForm };