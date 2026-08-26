import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
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
        <Container maxW="3xl" py={10}>
            <Stack gap={8}>
                <Stack gap={3}>
                    <Heading size="xl">Businesses</Heading>
                    <Button asChild colorPalette="yellow" alignSelf="start">
                        <NextLink href={newBusinessPagePath()}>Start a Business</NextLink>
                    </Button>
                </Stack>

                {cooperatives.length === 0 ? (
                    <Text color="gray.500">
                        No businesses yet...
                    </Text>
                ) : (
                    <Stack gap={4}>
                        {cooperatives.map((coop) => {
                            const isMember = currentUser
                                ? coop.memberships.some(
                                    (membership) => membership.userId === currentUser.user.id
                                )
                                : false;
                            
                            return (
                                <BusinessCard
                                    key={coop.id}
                                    coop={{
                                        id: coop.id,
                                        name: coop.name,
                                        description: coop.description,
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
    );
};

export default BusinessesPage;