"use client";

import {
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    Portal,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import {
    applyJobOpeningAction,
    type ApplyJobOpeningState,
} from "@/features/cooperatives/actions/apply-job-opening";
import { roleLabels } from "@/features/cooperatives/lib/role-labels";
import type { JobOpeningApplicationTarget } from "@/features/cooperatives/types";

type ApplyJobOpeningDialogProps = {
    coopId: string;
    coopName: string;
    jobOpening: JobOpeningApplicationTarget | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const initialState: ApplyJobOpeningState = {
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

const ApplyJobOpeningDialog = ({
    coopId,
    coopName,
    jobOpening,
    open,
    onOpenChange,
}: ApplyJobOpeningDialogProps) => {
    const [state, action, pending] = useActionState(applyJobOpeningAction, initialState);

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
        }
    }, [state.success, onOpenChange]);

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => onOpenChange(details.open)}
            placement="center"
            size="md"
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner p={4}>
                    <Dialog.Content
                        bg="app.surface"
                        color="app.text"
                        borderColor="app.border"
                        borderWidth="1px"
                        borderRadius="xl"
                        maxH="calc(100dvh - 2rem)"
                    >
                        <Dialog.Header pr={12}>
                            <Stack gap={1}>
                                <Dialog.Title color="app.text">Apply for This Job</Dialog.Title>

                                <Text color="app.mutedText" fontSize="sm">
                                    Apply to join {coopName}.
                                </Text>
                            </Stack>
                        </Dialog.Header>

                        <Dialog.Body overflowY="auto">
                            {jobOpening && (
                                <form action={action}>
                                    <Stack gap={5}>
                                        {state.errors.general?.[0] && (
                                            <Text color="red.600" fontSize="sm">
                                                {state.errors.general[0]}
                                            </Text>
                                        )}

                                        <input type="hidden" name="coopId" value={coopId} />
                                        <input type="hidden" name="jobOpeningId" value={jobOpening.id} />

                                        <Stack gap={1}>
                                            <Text fontWeight="semibold" color="brand.fg">
                                                {roleLabels[jobOpening.role]}
                                            </Text>

                                            <Text color="app.mutedText" fontSize="sm">
                                                {jobOpening.title}
                                            </Text>
                                        </Stack>

                                        <Field.Root
                                            invalid={Boolean(state.errors.response?.[0])}
                                            required
                                        >
                                            <Field.Label color="app.text">
                                                Why are you the best candidate for this role?
                                            </Field.Label>

                                            <Textarea
                                                name="response"
                                                placeholder="Write your response here..."
                                                rows={5}
                                                disabled={pending}
                                                required
                                                {...inputStyles}
                                            />

                                            <Field.ErrorText>
                                                {state.errors.response?.[0]}
                                            </Field.ErrorText>
                                        </Field.Root>

                                        <HStack justify="end" gap={3} wrap="wrap">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                colorPalette="brand"
                                                disabled={pending}
                                                onClick={() => onOpenChange(false)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                colorPalette="brand"
                                                loading={pending}
                                            >
                                                Submit Application
                                            </Button>
                                        </HStack>
                                    </Stack>
                                </form>
                            )}
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton
                                size="sm"
                                position="absolute"
                                top={3}
                                right={3}
                                color="app.mutedText"
                                disabled={pending}
                                _hover={{
                                    bg: "brand.subtle",
                                    color: "brand.fg",
                                }}
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export { ApplyJobOpeningDialog };