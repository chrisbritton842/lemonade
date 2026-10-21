"use client";

import {
    Button,
    Field,
    HStack,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import {
    createRuleProposalAction,
    type CreateRuleProposalState,
} from "@/features/command-center/actions/create-rule-proposal";

type CreateRuleProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateRuleProposalState = {
    success: false,
    errors: {},
};

const inputStyles = {
    bg: "app.surface",
    color: "app.text",
    borderColor: "app.border",
    focusRingColor: "brand.focusRing",
    _placeholder: {
        color: "app.mutedText",
    },
} as const;

const CreateRuleProposalForm = ({ coopId, onBack, onSuccess }: CreateRuleProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createRuleProposalAction,
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

                <Field.Root invalid={Boolean(state.errors.ruleText?.[0])} required>
                    <Field.Label color="app.text">Rule</Field.Label>
                    <Textarea
                        name="ruleText"
                        placeholder="Everyone must wash hands before making lemonade."
                        rows={3}
                        maxLength={200}
                        disabled={pending}
                        required
                        {...inputStyles}
                    />
                    <Field.ErrorText>{state.errors.ruleText?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label color="app.text">Reason</Field.Label>
                    <Textarea
                        name="reason"
                        placeholder="This keeps our lemonade safe and clean."
                        rows={3}
                        maxLength={300}
                        disabled={pending}
                        {...inputStyles}
                    />
                    <Field.ErrorText>{state.errors.reason?.[0]}</Field.ErrorText>
                </Field.Root>

                <HStack justify="space-between" gap={3}>
                    <Button
                        type="button"
                        variant="outline"
                        colorPalette="brand"
                        onClick={onBack}
                        disabled={pending}
                    >
                        Back
                    </Button>

                    <Button type="submit" colorPalette="brand" loading={pending}>
                        Create Proposal
                    </Button>
                </HStack>
            </Stack>
        </form>
    );
};

export { CreateRuleProposalForm };