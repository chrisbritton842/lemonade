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
    createProductProposalAction,
    type CreateProductProposalState,
} from "@/features/command-center/actions/create-product-proposal";

type CreateProductProposalFormProps = {
    coopId: string;
    onBack: () => void;
    onSuccess: () => void;
};

const initialState: CreateProductProposalState = {
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

const CreateProductProposalForm = ({
    coopId,
    onBack,
    onSuccess,
}: CreateProductProposalFormProps) => {
    const [state, action, pending] = useActionState(
        createProductProposalAction,
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

                <Field.Root invalid={Boolean(state.errors.productName?.[0])} required>
                    <Field.Label color="app.text">Product Name</Field.Label>
                    <Input
                        name="productName"
                        placeholder="Strawberry Lemonade"
                        disabled={pending}
                        {...inputStyles}
                    />
                    <Field.ErrorText>{state.errors.productName?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.productDescription?.[0])}>
                    <Field.Label color="app.text">Product Description</Field.Label>
                    <Textarea
                        name="productDescription"
                        placeholder="Describe the product."
                        disabled={pending}
                        rows={3}
                        {...inputStyles}
                    />
                    <Field.ErrorText>
                        {state.errors.productDescription?.[0]}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.priceDollars?.[0])} required>
                    <Field.Label color="app.text">Price</Field.Label>
                    <Input
                        name="priceDollars"
                        type="text"
                        inputMode="decimal"
                        placeholder="1.50"
                        disabled={pending}
                        {...inputStyles}
                    />
                    <Field.HelperText color="app.mutedText">Enter the price in dollars.</Field.HelperText>
                    <Field.ErrorText>{state.errors.priceDollars?.[0]}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.reason?.[0])}>
                    <Field.Label color="app.text">Reason</Field.Label>
                    <Textarea
                        name="reason"
                        placeholder="Explain why this product should be sold."
                        disabled={pending}
                        rows={3}
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

export { CreateProductProposalForm };