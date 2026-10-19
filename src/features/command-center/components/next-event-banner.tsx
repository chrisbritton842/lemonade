import {
    Badge,
    Card,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import type { CommandCenterEvent } from "@/features/command-center/types";

type NextEventBannerProps = {
    event: CommandCenterEvent | null;
};

const statusLabels = {
    CONFIRMED: "Confirmed",
    PROPOSED: "Proposed",
    NEEDS_APPROVAL: "Needs Approval",
    CANCELLED: "Cancelled",
};

const NextEventBanner = ({ event }: NextEventBannerProps) => {
    if (!event) {
        return null;
    }

    return (
        <Card.Root bg="app.subtleSurface" borderColor="brand.emphasized" borderWidth="1px">
            <Card.Body py={3}>
                <Stack gap={1}>
                    <HStack justify="space-between" align="center" gap={3} wrap="wrap">
                        <Text fontWeight="bold" color="app.text">
                            Next Event: {event.title}
                        </Text>

                        {event.status && (
                            <Badge 
                                colorPalette="brand"
                                variant="subtle"
                            >
                                {statusLabels[event.status]}
                            </Badge>
                        )}
                    </HStack>

                    <Text fontSize="sm" color="app.mutedText">
                        {event.startsAtLabel}
                        {event.location ? ` - ${event.location}` : ""}
                    </Text>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { NextEventBanner };