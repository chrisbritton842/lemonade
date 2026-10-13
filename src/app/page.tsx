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
import { businessesPagePath, newBusinessPagePath } from "@/paths";

const LandingPage = () => {
  return (
    <Center minHeight="calc(100vh - 80px)" bg="app.bg" px={4}>
      <Container maxW="3xl">
        <Stack gap={8} textAlign="center" align="center">
          <Box>
            <Heading size="3xl" color="brand.fg">
              Welcome to Lemonade, the all-in-one business management platform for kids!
            </Heading>
            <Text mt={4} fontSize="xl" color="app.mutedText">
              Start a new business or join an existing business!
            </Text>
          </Box>
          <HStack gap={4} wrap="wrap" justify="center">
            <Button
              asChild
              size="lg"
              colorPalette="brand"
            >
              <NextLink href={newBusinessPagePath()}>
                Start a New Business
              </NextLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              colorPalette="brand"
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
