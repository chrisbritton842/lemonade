"use client";

import {
    Badge,
    Box,
    Button,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { ApplyJobOpeningDialog } from "@/features/cooperatives/components/apply-job-opening-dialog";
import { roleLabels } from "@/features/cooperatives/lib/role-labels";
import type { BusinessCardJobOpening } from "@/features/cooperatives/types";

type BusinessCardJobOpeningsProps = {
    coopId: string;
    coopName: string;
    jobOpenings: BusinessCardJobOpening[];
};

const BusinessCardJobOpenings = ({
    coopId,
    coopName,
    jobOpenings,
}: BusinessCardJobOpeningsProps) => {
    const [selectedJobOpening, setSelectedJobOpening] =
        useState<BusinessCardJobOpening | null>(null);

    if (jobOpenings.length === 0) {
        return null;
    }

    return (
        <>
            <Stack gap={3}>
                <HStack gap={2} wrap="wrap">
                    <Badge colorPalette="brand" variant="subtle">
                        Now Hiring!
                    </Badge>

                    <Text color="app.mutedText" fontSize="sm">
                        Click a position to apply.
                    </Text>
                </HStack>

                <Stack gap={2}>
                    {jobOpenings.map((jobOpening) => (
                        <Button
                            key={jobOpening.id}
                            type="button"
                            variant="outline"
                            colorPalette="brand"
                            bg="app.surface"
                            color="app.text"
                            borderColor="app.border"
                            borderRadius="lg"
                            justifyContent="flex-start"
                            h="auto"
                            w="full"
                            px={4}
                            py={3}
                            whiteSpace="normal"
                            textAlign="left"
                            transition="background-color 0.2s, border-color 0.2s"
                            _hover={{
                                bg: "brand.subtle",
                                borderColor: "brand.emphasized",
                            }}
                            _focusVisible={{
                                outlineColor: "brand.focusRing",
                                outlineWidth: "2px",
                                outlineStyle: "solid",
                                outlineOffset: "2px",
                            }}
                            onClick={() => setSelectedJobOpening(jobOpening)}
                        >
                            <Box textAlign="left" minW={0} w="full">
                                <Stack gap={1}>
                                    <Text fontWeight="semibold" color="app.text" overflowWrap="anywhere">
                                        {roleLabels[jobOpening.role]}
                                    </Text>
                                    <Text color="app.mutedText" fontSize="sm" overflowWrap="anywhere">
                                        {jobOpening.title}
                                    </Text>
                                </Stack>
                            </Box>
                        </Button>
                    ))}
                </Stack>
            </Stack>

            <ApplyJobOpeningDialog
                coopId={coopId}
                coopName={coopName}
                jobOpening={selectedJobOpening}
                open={Boolean(selectedJobOpening)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedJobOpening(null);
                    }
                }}
            />
        </>
    );
};

export { BusinessCardJobOpenings };