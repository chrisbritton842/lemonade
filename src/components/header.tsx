import { Box, Button, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { signOutAction } from "@/features/auth/actions/sign-out";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  businessesPagePath,
  homePagePath,
  landingPagePath,
  signInPagePath,
  signUpPagePath
} from "@/paths";

const Header = async () => {
  const currentUser = await getCurrentUser();
  const isSignedIn = Boolean(currentUser);

  return (
    <Box
      bg="app.surface"
      px={6}
      py={4}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor="app.border"
      color="app.text"
    >
      <Flex align="center" gap={4} wrap="wrap">
        <NextLink href={landingPagePath()}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.fg"
            _hover={{ color: "sky.600" }}
          >
            Lemonade
          </Text>
        </NextLink>

        <Spacer />

        <HStack gap={3} wrap="wrap">
          {isSignedIn ? (
            <>
              <Button asChild colorPalette="brand">
                <NextLink href={homePagePath()}>
                  Home
                </NextLink>
              </Button>

              <Button
                asChild
                variant="outline"
                colorPalette="brand"
              >
                <NextLink href={businessesPagePath()}>
                  Businesses
                </NextLink>
              </Button>

              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  colorPalette="brand"
                >
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild colorPalette="brand">
                <NextLink href={signUpPagePath()}>
                  Sign Up
                </NextLink>
              </Button>

              <Button
                asChild
                variant="outline"
                colorPalette="brand"
              >
                <NextLink href={signInPagePath()}>
                  Sign In
                </NextLink>
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export { Header };