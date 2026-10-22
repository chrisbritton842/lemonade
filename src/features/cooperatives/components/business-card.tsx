import {
    Badge,
    Button,
    Card,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import type { BusinessCardCoop } from "@/features/cooperatives/types";
import {
    businessPagePath,
    commandCenterPagePath,
} from "@/paths";
import { BusinessCardJobOpenings } from "./business-card-job-openings";

type BusinessCardProps = {
    coop: BusinessCardCoop;
};

const BusinessCard = ({ coop }: BusinessCardProps) => {
    const hasOpenJobOpenings = coop.jobOpenings.length > 0;

    return (
        <Card.Root
            bg="app.surface"
            borderColor="app.border"
        >
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={2}>
                        <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                            <Text fontWeight="bold" fontSize="lg" color="app.text" overflowWrap="anywhere">
                                {coop.name}
                            </Text>

                            <HStack gap={2} wrap="wrap">
                                {coop.isMember && (
                                    <Badge colorPalette="brand" variant="subtle">Member</Badge>
                                )}

                                {hasOpenJobOpenings && (
                                    <Badge colorPalette="indigo" variant="subtle">
                                        Now Hiring!
                                    </Badge>
                                )}
                            </HStack> 
                        </HStack>

                        <Text color="app.mutedText" fontSize="sm">
                            {coop.description || "No description yet."}
                        </Text>
                    </Stack>

                    <HStack gap={2} wrap="wrap">
                        <Badge
                            variant="outline"
                            color="app.mutedText"
                            borderColor="app.border"
                        >
                            {coop.memberCount} member{coop.memberCount === 1 ? "" : "s"}
                        </Badge>

                        <Badge
                            variant="outline"
                            color="app.mutedText"
                            borderColor="app.border"
                        >
                            {coop.taskCount} job{coop.taskCount === 1 ? "" : "s"}
                        </Badge>

                        <Badge
                            variant="outline"
                            color="app.mutedText"
                            borderColor="app.border"
                        >
                            {coop.eventCount} event{coop.eventCount === 1 ? "" : "s"}
                        </Badge>

                        {hasOpenJobOpenings && (
                            <Badge
                                variant="outline"
                                color="app.mutedText"
                                borderColor="app.border"
                            >
                                {coop.jobOpenings.length} opening
                                {coop.jobOpenings.length === 1 ? "" : "s"}
                            </Badge>
                        )}
                    </HStack>

                    {!coop.isMember && coop.jobOpenings.length > 0 && (
                        <BusinessCardJobOpenings
                            coopId={coop.id}
                            coopName={coop.name}
                            jobOpenings={coop.jobOpenings}
                        />
                    )}

                    <HStack gap={3} wrap="wrap">
                        <Button
                            asChild
                            colorPalette="brand"
                            variant={coop.isMember ? "outline" : "solid"}
                            size="sm"
                        >
                            <NextLink href={businessPagePath(coop.id)}>
                                View Business
                            </NextLink>
                        </Button>

                        {coop.isMember && (
                            <Button asChild colorPalette="brand" size="sm">
                                <NextLink href={commandCenterPagePath(coop.id)}>
                                    Open Command Center
                                </NextLink>
                            </Button>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { BusinessCard };