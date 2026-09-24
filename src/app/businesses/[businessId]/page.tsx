import {
    Badge,
    Button,
    Card,
    Container,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { EventStatus, EventType, JobOpeningStatus } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath } from "@/paths";

type BusinessPageProps = {
    params: Promise<{
        businessId: string;
    }>;
};

const APP_TIME_ZONE = "America/Los_Angeles";

const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(priceCents / 100);
};

const formatEventDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        timeZone: APP_TIME_ZONE,
        weekday: "long",
        month: "long",
        day: "numeric",
    });
};

const formatEventTime = (startsAt: Date, endsAt: Date | null) => {
    const startLabel = startsAt.toLocaleTimeString("en-US", {
        timeZone: APP_TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
    });

    if (!endsAt) {
        return startLabel;
    }

    const endLabel = endsAt.toLocaleTimeString("en-US", {
        timeZone: APP_TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
    });

    return `${startLabel} - ${endLabel}`;
};

const BusinessPage = async ({ params }: BusinessPageProps) => {
    const { businessId } = await params;
    const currentUser = await getCurrentUser();
    const now = new Date();

    const business = await prisma.cooperative.findUnique({
        where: {
            id: businessId,
        },
        include: {
            memberships: currentUser
             ? {
                where: {
                    userId: currentUser.user.id,
                },
                select: {
                    id: true,
                },
             }
             : false,
            events : {
                where: {
                    type: EventType.SALES_DAY,
                    status: {
                        not: EventStatus.CANCELLED,
                    },
                    startsAt: {
                        gte: now,
                    },
                },
                orderBy: {
                    startsAt: "asc",
                },
                take: 5,
            },
            products: {
                where: {
                    isActive: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
            jobOpenings: {
                where: {
                    status: JobOpeningStatus.OPEN,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            _count: {
                select: {
                    memberships: true,
                },
            },
        },
    });

    if (!business) {
        notFound();
    }

    const isMember = currentUser ? business.memberships.length > 0 : false;

    return (
        <Container maxW="5xl" py={8}>
            <Stack gap={8}>
                <Card.Root>
                    <Card.Body>
                        <Stack gap={4}>
                            <HStack justify="space-between" align="start" gap={4}>
                                <Stack gap={2}>
                                    <Heading size="xl">{business.name}</Heading>

                                    {business.description ? (
                                        <Text color="gray.600">{business.description}</Text>
                                    ) : (
                                        <Text color="gray.600">
                                            This business has not added a description yet.
                                        </Text>
                                    )}
                                </Stack>

                                {isMember && (
                                    <Badge colorPalette="yellow" variant="subtle">
                                        Member
                                    </Badge>
                                )}
                            </HStack>

                            <Text color="gray.600" fontSize="sm">
                                {business._count.memberships} member
                                {business._count.memberships === 1 ? "" : "s"}
                            </Text>

                            {isMember && (
                                <Button asChild colorPalette="yellow" alignSelf="start">
                                    <NextLink href={commandCenterPagePath(business.id)}>
                                        Open Command Center
                                    </NextLink>
                                </Button>
                            )}
                        </Stack>
                    </Card.Body>
                </Card.Root>

                <Stack gap={4}>
                    <Heading size="lg">Upcoming Events</Heading>

                    {business.events.length === 0 ? (
                        <Card.Root>
                            <Card.Body>
                                <Text color="gray.600">
                                    There are no events yet.
                                </Text>
                            </Card.Body>
                        </Card.Root>
                    ) : (
                        <Stack gap={3}>
                            {business.events.map((event) => (
                            <Card.Root key={event.id}>
                                <Card.Body>
                                    <Stack gap={2}>
                                        <HStack justify="space-between" align="start" gap={3}>
                                            <Stack gap={1}>
                                                <Heading size="sm">{event.title}</Heading>
                                                <Text color="gray.600" fontSize="sm">
                                                    {formatEventDate(event.startsAt)} -{" "}
                                                    {formatEventTime(event.startsAt, event.endsAt)}
                                                </Text>
                                            </Stack>

                                            <Badge colorPalette="green" variant="subtle">
                                                Sales Day
                                            </Badge>
                                        </HStack>

                                        {event.location && (
                                            <Text color="gray.600" fontSize="sm">
                                                {event.location}
                                            </Text>
                                        )}

                                        {event.description && (
                                            <Text color="gray.700" fontSize="sm">
                                                {event.description}
                                            </Text>
                                        )}
                                    </Stack>
                                </Card.Body>
                            </Card.Root>
                            ))}
                        </Stack>
                    )}
                </Stack>

                <Stack gap={4}>
                    <Heading size="lg">Products</Heading>

                    {business.products.length === 0 ? (
                        <Card.Root>
                            <Card.Body>
                                <Text color="gray.600">
                                This business has not added products yet.
                                </Text>
                            </Card.Body>
                        </Card.Root>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {business.products.map((product) => (
                                <Card.Root key={product.id}>
                                    <Card.Body>
                                        <Stack gap={3}>
                                            <HStack justify="space-between" align="start" gap={3}>
                                                <Stack gap={1}>
                                                    <Heading size="sm">{product.name}</Heading>

                                                    {product.description && (
                                                        <Text color="gray.600" fontSize="sm">
                                                            {product.description}
                                                        </Text>
                                                    )}
                                                </Stack>
                                                <Badge colorPalette="green">
                                                    {formatPrice(product.priceCents)}
                                                </Badge>
                                            </HStack>
                                        </Stack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    )}
                </Stack>

                <Stack gap={4}>
                    <Heading size="lg">Job Openings</Heading>

                    {business.jobOpenings.length === 0 ? (
                        <Card.Root>
                            <Card.Body>
                                <Text color="gray.600">
                                    There are no job openings at this time.
                                </Text>
                            </Card.Body>
                        </Card.Root>
                    ) : (
                        <Stack gap={3}>
                            {business.jobOpenings.map((jobOpening) => (
                                <Card.Root key={jobOpening.id}>
                                    <Card.Body>
                                        <Stack gap={2}>
                                            <HStack justify="space-between" align="start" gap={3}>
                                                <Stack gap={1}>
                                                    <Heading size="sm">{jobOpening.title}</Heading>

                                                    {jobOpening.description && (
                                                        <Text color="gray.600" fontSize="sm">
                                                            {jobOpening.description}
                                                        </Text>
                                                    )}
                                                </Stack>

                                                <Badge colorPalette="blue" variant="subtle">
                                                    {jobOpening.role}
                                                </Badge>
                                            </HStack>
                                        </Stack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Container>
    );
};

export default BusinessPage;