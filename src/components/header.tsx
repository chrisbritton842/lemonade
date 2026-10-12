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
      bg="white"
      px={6}
      py={4}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex align="center">
        <Link
          as={NextLink}
          href={landingPagePath()}
          _hover={{ textDecoration: "none", color: "teal.600" }}
        >
          <Text fontSize="xl" fontWeight="bold" color="teal.500">
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
                <Button variant="ghost" colorPalette="teal">
                  Home
                </Button>
              </Link>

              <Link
                as={NextLink}
                href={businessesPagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button variant="outline" colorPalette="teal">
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
                <Button colorPalette="teal">Sign Up</Button>
              </Link>

              <Link
                as={NextLink}
                href={signInPagePath()}
                _hover={{ textDecoration: "none" }}
              >
                <Button variant="outline" colorPalette="gray">
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