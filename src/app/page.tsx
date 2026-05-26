import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { businessesPagePath,newBusinessPagePath } from "@/paths";

const LandingPage = () => {
  return (
    <Center minHeight="calc(100vh - 80px)" bg="yellow.50" px={4}>
      <Container maxW="3xl">
        <Stack gap={8} textAlign="center" align="center">
          <Box>
            <Heading size="3xl" color="yellow.700">
              Welcome to Lemonade, the all-in-one business management platform for kids!
            </Heading>
            <Text mt={4} fontSize="xl" color="gray.700">
              Start a new business or join an existing business!
            </Text>
          </Box>
          <HStack gap={4}>
            <Button
              asChild
              size="lg"
              colorPalette="yellow"
            >
              <NextLink href={newBusinessPagePath()}>
                Start a New Business
              </NextLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              colorPalette="yellow"
            >
              <NextLink href={businessesPagePath()}>
                Join an Existing Business
              </NextLink>
            </Button>
          </HStack>
        </Stack>
      </Container>
    </Center>
  );
};

export default LandingPage;
