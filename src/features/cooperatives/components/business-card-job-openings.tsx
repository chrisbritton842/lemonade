"use cllient";

import {
    Badge,
    Box,
    Button,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { roleLabels } from "@/features/cooperatives/lib/role-labels";
import type { BusinessCardJobOpening } from "@/features/cooperatives/types";
import { ApplyJobOpeningDialog } from "./apply-job-opening-dialog";

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
            <Stack gap={2}>
                <HStack gap={2}>
                    <Badge colorPalette="green" variant="subtle">
                        Now Hiring!
                    </Badge>

                    <Text color="gray.600" fontSize="sm">
                        Click a position to apply.
                    </Text>
                </HStack>

                <Stack gap={2}>
                    {jobOpenings.map((jobOpening) => (
                        <Button
                            key={jobOpening.id}
                            type="button"
                            variant="outline"
                            justifyContent="start"
                            h="auto"
                            py={3}
                            whiteSpace="normal"
                            onClick={() => setSelectedJobOpening(jobOpening)}
                        >
                            <Box textAlign="left">
                                <Text fontWeight="semibold">
                                    {roleLabels[jobOpening.role]}
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    {jobOpening.title}
                                </Text>
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