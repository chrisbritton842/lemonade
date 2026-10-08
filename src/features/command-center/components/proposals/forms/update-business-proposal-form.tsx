"use client";

import {
    Button,
    Field,
    Input,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect, useState } from "react";
import {
    updateBusinessProposalAction,
    type UpdateBusinessProposalState,
} from "@/features/command-center/actions/update-business-proposal";

type UpdateBusinessProposalFormProps = {
    coopId: string;
    currentName: string;
    currentDescription: string | null;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: UpdateBusinessProposalState = {
    success: false,
    errors: {},
};

const UpdateBusinessProposalForm = ({
    coopId,
    currentName,
    currentDescription,
    onBack,
    onSuccess,
}: UpdateBusinessProposalFormProps) => {
    const [state, action, pending] = useActionState(
        updateBusinessProposalAction,
        initialState
    );

    const [businessName, setBusinessName] = useState(currentName);
    const [businessDescription, setBusinessDescription] = useState(
        currentDescription ?? ""
    );

    useEffect(() => {
        if (state.success) {
            onSuccess();
        }
    }, [state.success, onSuccess]);

    return (
        <form action={action}>
            <Stack gap={4}>
                <input type="hidden" name="coopId" value={coopId} />

                {state.errors.general?.[0] && (
                    <Text color="red.600" fontSize="sm">{state.errors.general[0]}</Text>
                )}

                <Field.Root invalid={Boolean(state.errors.businessName?.[0])} required>
                    <Field.Label>Business Name</Field.Label>

                    <Input
                        name="businessName"
                        value={businessName}
                        onChange={(event) => setBusinessName(event.currentTarget.value)}
                        placeholder="Example: Zest Friends Lemonade"
                        disabled={pending}
                        maxLength={80}
                    />

                    <Field.ErrorText>
                        {state.errors.businessName?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root
                    invalid={Boolean(state.errors.businessDescription?.[0])}
                >
                    <Field.Label>Business Description</Field.Label>

                    <Textarea
                        name="businessDescription"
                        value={businessDescription}
                        onChange={(event) =>
                            setBusinessDescription(event.currentTarget.value)
                        }
                        placeholder="Example: A kid-run lemonade business serving fresh lemonade on weekends."
                        rows={4}
                        disabled={pending}
                        maxLength={300}
                    />

                    <Field.ErrorText>
                        {state.errors.businessDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label>Reason</Field.Label>

                    <Textarea
                        name="reason"
                        placeholder="Example: The new name better explains what we sell."
                        rows={3}
                        disabled={pending}
                        maxLength={300}
                    />

                    <Field.ErrorText>
                        {state.errors.reason?.[0]}
                    </Field.ErrorText>
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

                    <Button type="submit" colorPalette="yellow" loading={pending}>
                        Propose Business Update
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export { UpdateBusinessProposalForm };