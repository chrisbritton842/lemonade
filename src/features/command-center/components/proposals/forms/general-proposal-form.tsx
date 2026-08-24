"use client";

import {
    Button,
    Field,
    HStack,
    Input,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import {
    createGeneralProposalAction,
    type CreateGeneralProposalState,
} from "@/features/command-center/actions/create-general-proposal";

type GeneralProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateGeneralProposalState = {
    success: false,
    errors: {},
};

const GeneralProposalForm = ({
    coopId,
    onBack,
    onSuccess,
}: GeneralProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createGeneralProposalAction,
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

                <Field.Root invalid={Boolean(state.errors.title?.[0])} required>
                    <Field.Label>Title</Field.Label>
                    <Input
                        name="title"
                        placeholder="Sell lemonade for charity"
                        disabled={pending}
                    />
                    <Field.ErrorText>{state.errors.title?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.description?.[0])} required>
                    <Field.Label>Proposal Description</Field.Label>
                    <Textarea
                        name="description"
                        placeholder="Explain your idea so other members can vote on it."
                        disabled={pending}
                        rows={5}
                    />
                    <Field.ErrorText>{state.errors.description?.[0]}</Field.ErrorText>
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

export { GeneralProposalForm };