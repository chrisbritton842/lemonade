import {
    Button,
    Card,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Check } from "lucide-react";
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
    const showJobOpenings = !coop.isMember && coop.jobOpenings.length > 0;

    return (
        <Card.Root
            bg="app.surface"
            borderColor="app.border"
        >
            <Card.Body>
                <Stack gap={4}>
                    <Stack gap={2}>
                        <HStack justify="space-between" align="start" gap={3} wrap="wrap">
                            <Text
                                fontWeight="bold"
                                fontSize="lg"
                                color="app.text"
                                overflowWrap="anywhere"
                            >
                                {coop.name}
                            </Text>

                            {coop.isMember && (
                                <HStack gap={1} color="app.mutedText" flexShrink={0}>
                                    <Check size={15} aria-hidden="true" />
                                    <Text fontSize="sm" fontWeight="medium">
                                        Joined
                                    </Text>
                                </HStack>
                            )} 
                        </HStack>

                        <Text color="app.mutedText" fontSize="sm" overflowWrap="anywhere">
                            {coop.description || "No description yet."}
                        </Text>
                    </Stack>

                    {showJobOpenings && (
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
                                    Command Center
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