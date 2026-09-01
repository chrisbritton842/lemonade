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
    createJobOpeningProposalAction,
    type CreateJobOpeningProposalState,
} from "@/features/command-center/actions/create-job-opening-proposal";

type CreateJobOpeningProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateJobOpeningProposalState = {
    success: false,
    errors: {},
};

const CreateJobOpeningProposalForm = ({
    coopId,
    onBack,
    onSuccess,
}: CreateJobOpeningProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createJobOpeningProposalAction,
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

                <Field.Root invalid={Boolean(state.errors.jobTitle?.[0])} required>
                    <Field.Label>Job Opening Title</Field.Label>
                    <Input
                        name="jobTitle"
                        placeholder="Saturday cashier"
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.jobTitle?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.jobDescription?.[0])}>
                    <Field.Label>Job Description</Field.Label>
                    <Textarea
                        name="jobDescription"
                        placeholder="Describe what this person would help with."
                        rows={3}
                        disabled={pending}
                    />
                    <Field.ErrorText>
                        {state.errors.jobDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.role?.[0])}>
                    <Field.Label>Position</Field.Label>

                    <NativeSelect.Root disabled={pending}>
                        <NativeSelect.Field name="role">
                            <option value="BOARD_OF_DIRECTORS">Board Member</option>
                            <option value="PRODUCTION">Production Coordinator</option>
                            <option value="CUSTOMER_SERVICE">Customer Service Representative</option>
                            <option value="INVENTORY">Inventory Coordinator</option>
                            <option value="MARKETING">Marketing Coordinator</option>
                            <option value="ACCOUNTING">Treasurer</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <Field.ErrorText>{state.errors.role?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label>Reason</Field.Label>
                    <Textarea
                        name="reason"
                        placeholder="Explain why the team needs this job opening."
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

export { CreateJobOpeningProposalForm };