import { Box, Button, Flex, HStack, Link, Spacer,Text } from "@chakra-ui/react";
import NextLink from "next/link";
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
      <Flex align="center">
        <Link
          as={NextLink}
          href={landingPagePath()}
          _hover={{ textDecoration: "none", color: "brand.fg" }}
        >
          <Text fontSize="xl" fontWeight="bold" color="brand.fg">
            Lemonade
          </Text>
        </Link>

        <Spacer />

        <HStack gap={4}>
          {isSignedIn ? (
            <>
              <Link
                as={NextLink}
                href={homePagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button colorPalette="brand">
                  Home
                </Button>
              </Link>

              <Link
                as={NextLink}
                href={businessesPagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button variant="outline" colorPalette="brand">
                  Businesses
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                as={NextLink}
                href={signUpPagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button colorPalette="brand">Sign Up</Button>
              </Link>

              <Link
                as={NextLink}
                href={signInPagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button variant="outline" colorPalette="brand">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export { Header };