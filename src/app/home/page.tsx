import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Boxes,
  Calculator,
  GlassWater,
  Handshake,
  type LucideIcon,
  Megaphone,
  UsersRound,
} from "lucide-react";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { CoopRole } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import {
  businessesPagePath,
  commandCenterPagePath,
  newBusinessPagePath,
  signInPagePath,
} from "@/paths";

const roleInfo: Record<
  CoopRole,
  { label: string; icon: LucideIcon }
  > = {
    [CoopRole.BOARD_OF_DIRECTORS]: {
      label: "Board of Directors",
      icon: UsersRound,
    },
    [CoopRole.PRODUCTION]: {
      label: "Production",
      icon: GlassWater,
    },
    [CoopRole.CUSTOMER_SERVICE]: {
      label: "Customer Service",
      icon: Handshake,
    },
    [CoopRole.INVENTORY]: {
      label: "Inventory",
      icon: Boxes,
    },
    [CoopRole.MARKETING]: {
      label: "Marketing",
      icon: Megaphone,
    },
    [CoopRole.ACCOUNTING]: {
      label: "Accounting",
      icon: Calculator,
    },
  };

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(signInPagePath());
  }

  const memberships = await prisma.membership.findMany({
    where: {
      userId: currentUser.user.id,
    },
    orderBy: {
      createdAt: "desc",
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
    <Box
      bg="app.bg"
      color="app.text"
      minH="calc(100vh - 80px)"
    >
      <Container maxW="4xl" py={8}>
        <Stack gap={8}>
          <Heading size="lg" color="app.text">Your Businesses</Heading>

          {memberships.length === 0 ? (
            <Card.Root
              bg="app.surface"
              borderColor="app.border"
            >
              <Card.Body>
                <Stack gap={1}>
                  <Heading size="md" color="app.text">No businesses yet</Heading>
                  <Text color="app.mutedText">
                    Start a new lemonade business or join an existing one.
                  </Text>
                </Stack>
              </Card.Body>
            </Card.Root>
          ) : (
            <Stack gap={4}>
              {memberships.map((membership) => (
                <Card.Root key={membership.id} bg="app.surface" borderColor="app.border">
                  <Card.Body>
                    <Stack gap={4}>
                      <Stack gap={3}>
                        <Stack gap={1}>
                          <Heading size="md" color="app.text">
                            {membership.cooperative.name}
                          </Heading>

                          {membership.cooperative.description && (
                            <Text color="app.mutedText">
                              {membership.cooperative.description}
                            </Text>
                          )}
                        </Stack>

                        {membership.roles.length > 0 && (
                          <HStack gap={2} wrap="wrap">
                            {membership.roles.map(
                              (membershipRole) => {
                                const role =
                                  roleInfo[membershipRole.role];
                                const RoleIcon = role.icon;

                                return (
                                  <Badge
                                    key={membershipRole.id}
                                    colorPalette="brand"
                                    variant="subtle"
                                    gap={2}
                                    px={3}
                                    py={1.5}
                                  >
                                    <RoleIcon
                                      size={16}
                                      aria-hidden="true"
                                    />
                                    {role.label}
                                  </Badge>
                                );
                              }
                            )}
                          </HStack>
                        )}
                      </Stack>

                      <Button asChild colorPalette="brand" alignSelf="start">
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
            <Button asChild colorPalette="brand">
              <NextLink href={newBusinessPagePath()}>
                Start New Business
              </NextLink>
            </Button>

            <Button asChild variant="outline" colorPalette="brand">
              <NextLink href={businessesPagePath()}>
                Join New Business
              </NextLink>
            </Button>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;