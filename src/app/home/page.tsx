import {
  Badge,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import {
  businessesPagePath,
  commandCenterPagePath,
  newBusinessPagePath,
  signInPagePath,
} from "@/paths";

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(signInPagePath());
  }

  const memberships = await prisma.membership.findMany({
    where: {
      userId: currentUser.user.id,
    },
    include: {
      roles: true,
      cooperative: {
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: {
              memberships: true,
              tasks: true,
              events: true,
            },
          },
        },
      },
    },
  });

  return (
    <Container maxW="4xl" py={8}>
      <Stack gap={8}>
        <Heading size="lg">Your Businesses</Heading>

        {memberships.length === 0 ? (
          <Card.Root>
            <Card.Body>
              <Stack gap={4}>
                <Stack gap={1}>
                  <Heading size="md">No businesses yet</Heading>
                  <Text color="gray.600">
                    Start a new lemonade business or join an existing one.
                  </Text>
                </Stack>
              </Stack>
            </Card.Body>
          </Card.Root>
        ) : (
          <Stack gap={4}>
            {memberships.map((membership) => (
              <Card.Root key={membership.id}>
                <Card.Body>
                  <Stack gap={4}>
                    <Stack gap={2}>
                      <HStack justify="space-between" align="start" gap={4}>
                        <Stack gap={1}>
                          <Heading size="md">{membership.cooperative.name}</Heading>

                          {membership.cooperative.description && (
                            <Text color="gray.600">
                              {membership.cooperative.description}
                            </Text>
                          )}
                        </Stack>
                      </HStack>

                      {membership.roles.length > 0 && (
                        <HStack gap={2} wrap="wrap">
                          {membership.roles.map((membershipRole) => (
                            <Badge
                              key={membershipRole.id}
                              colorPalette="blue"
                              variant="subtle"
                            >
                              {membershipRole.role}
                            </Badge>
                          ))}
                        </HStack>
                      )} 
                    </Stack>

                    <Button asChild colorPalette="yellow" alignSelf="start">
                      <NextLink
                        href={commandCenterPagePath(membership.cooperative.id)}
                        >
                          Open Command Center
                        </NextLink>
                    </Button>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        )}

        <HStack gap={3} wrap="wrap">
          <Button asChild colorPalette="yellow">
            <NextLink href={newBusinessPagePath()}>
              Start New Business
            </NextLink>
          </Button>

          <Button asChild variant="outline">
            <NextLink href={businessesPagePath()}>
              Join New Business
            </NextLink>
          </Button>
        </HStack>
      </Stack>
    </Container>
  );
};

export default HomePage;