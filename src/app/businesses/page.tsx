import { Box,Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { BusinessCard } from "@/features/cooperatives/components/business-card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { newBusinessPagePath } from "@/paths";

const BusinessesPage = async () => {
    const currentUser = await getCurrentUser();

    const cooperatives = await prisma.cooperative.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            memberships: {
                select: {
                    userId: true,
                },
            },
            jobOpenings: {
                where: {
                    status: "OPEN",
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    title: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    memberships: true,
                    tasks: true,
                    events: true,
                },
            },
        },
    });

    return (
        <Box bg="app.bg" color="app.text" minH="calc(100vh - 80px)">
            <Container maxW="3xl" py={10}>
                <Stack gap={8}>
                    <Stack gap={3}>
                        <Heading size="xl" color="app.text">
                            Businesses
                        </Heading>
                        <Button asChild colorPalette="brand" alignSelf="start">
                            <NextLink href={newBusinessPagePath()}>
                                Start a Business
                            </NextLink>
                        </Button>
                    </Stack>

                    {cooperatives.length === 0 ? (
                        <Text color="app.mutedText">
                            No businesses yet...
                        </Text>
                    ) : (
                        <Stack gap={4}>
                            {cooperatives.map((coop) => {
                                const isMember = currentUser
                                    ? coop.memberships.some(
                                        (membership) =>
                                            membership.userId === currentUser.user.id
                                    )
                                    : false;
                            
                                return (
                                    <BusinessCard
                                        key={coop.id}
                                        coop={{
                                            id: coop.id,
                                            name: coop.name,
                                            description: coop.description,
                                            jobOpenings: coop.jobOpenings,
                                            memberCount: coop._count.memberships,
                                            taskCount: coop._count.tasks,
                                            eventCount: coop._count.events,
                                            isMember,
                                        }}
                                    />
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

export default BusinessesPage;