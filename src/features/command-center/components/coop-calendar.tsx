import {
    Badge,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import type { CommandCenterCalendarEvent } from "../types";

type CoopCalendarProps = {
    events: CommandCenterCalendarEvent[];
};

const eventTypeLabels: Record<string, string> = {
    SALES_DAY: "Sales Day",
    MEETING: "Meeting",
    SUPPLY_RUN: "Supply Run",
    PREP_WORK: "Prep Work",
    BOARD_MEETING: "Board Meeting",
    MARKETING_OUTREACH: "Spread the Word",
    OTHER: "Other",
};

const eventStatusLabels: Record<string, string> = {
    PROPOSED: "Proposed",
    CONFIRMED: "Confirmed",
    NEEDS_APPROVAL: "Needs Approval",
    CANCELLED: "Cancelled",
};

const groupEventsByDate = (events: CommandCenterCalendarEvent[]) => {
    return events.reduce<
    {
        dateKey: string;
        dateLabel: string;
        events: CommandCenterCalendarEvent[];
    }[]
    >((groups, event) => {
        const existingGroup = groups.find((group) => group.dateKey === event.dateKey);

        if (existingGroup) {
            existingGroup.events.push(event);
            return groups;
        }

        groups.push({
            dateKey: event.dateKey,
            dateLabel: event.dateLabel,
            events: [event],
        });

        return groups;
    }, []);
};

const CoopCalendar = ({ events }: CoopCalendarProps) => {
    const eventGroups = groupEventsByDate(events);

    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">Calendar</Heading>
                        <Text color="gray.600" fontSize="sm">
                            Upcoming sales days, meetings, supply runs, and prep work.
                        </Text>
                    </Stack>

                    {events.length === 0 ? (
                        <Text color="gray.600" fontSize="sm">
                            There are no upcoming events yet.
                        </Text>
                    ) : (
                        <Stack gap={5}>
                            {eventGroups.map((group) => (
                                <Stack key={group.dateKey} gap={3}>
                                    <Heading size="sm">{group.dateLabel}</Heading>

                                    <Stack gap={3}>
                                        {group.events.map((event) => (
                                            <Card.Root key={event.id} variant="subtle">
                                                <Card.Body>
                                                    <Stack gap={3}>
                                                        <HStack justify="space-between" align="start" gap={3}>
                                                            <Stack gap={1}>
                                                                <Text fontWeight="semibold">
                                                                    {event.title}
                                                                </Text>

                                                                <Text color="gray.600" fontSize="sm">
                                                                    {event.timeLabel}
                                                                    {event.location
                                                                        ? ` at ${event.location}`
                                                                        : ""}
                                                                </Text>
                                                            </Stack>

                                                            <Badge colorPalette="yellow">
                                                                {eventTypeLabels[event.type] ?? event.type}
                                                            </Badge>
                                                        </HStack>

                                                        {event.description && (
                                                            <Text color="gray.600" fontSize="sm">
                                                                {event.description}
                                                            </Text>
                                                        )}

                                                        <HStack gap={2} wrap="warp">
                                                            <Badge variant="outline">
                                                                {eventStatusLabels[event.status] ?? event.status}
                                                            </Badge>
                                                        </HStack>
                                                    </Stack>
                                                </Card.Body>
                                            </Card.Root>
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { CoopCalendar };