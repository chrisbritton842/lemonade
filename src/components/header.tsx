"use client";

import { Box, Button, Flex, HStack, Link, Spacer,Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { landingPagePath, signInPagePath, signUpPagePath } from "@/paths";

const Header = () => {
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
        {/* Brand */}
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

        {/* Navigation Buttons */}
        <HStack gap={4}>
          <Link as={NextLink} href={signUpPagePath()} _hover={{ textDecoration: "none" }}>
            <Button colorScheme="teal">Sign Up</Button>
          </Link>

          <Link as={NextLink} href={signInPagePath()} _hover={{ textDecoration: "none" }}>
            <Button variant="outline" colorScheme="gray">Sign In</Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export { Header };