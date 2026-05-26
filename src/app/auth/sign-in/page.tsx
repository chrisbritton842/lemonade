"use client";

import {
    Button,
    Card,
    Center,
    Field,
    Heading,
    Input,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/features/auth/actions/sign-in";
import { SignInState } from "@/features/auth/actions/sign-in";
import { signUpPagePath } from "@/paths";

const initialState: SignInState = {
    success: false,
    errors: {},
};

const SignInPage = () => {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signInAction,
    initialState
  );

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      <Card.Root maxW="420px" w="full" shadow="lg" borderRadius="xl">
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={2} textAlign="center">
              <Heading size="lg">Sign In</Heading>
              <Text color="gray.600">
                Welcome back to Lemonade!
              </Text>
            </Stack>
            
            <form action={action}>
              <Stack gap={5}>
                {state.errors.general?.[0] && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {state.errors.general[0]}
                  </Text>
                )}

                <Field.Root invalid={Boolean(state.errors.username)}>
                  <Field.Label>Username</Field.Label>
                  <Input
                    name="username"
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                  <Field.ErrorText>
                    {state.errors.username?.[0]}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(state.errors.password)}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <Field.ErrorText>
                    {state.errors.password?.[0]}
                  </Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  loading={pending}
                  size="lg"
                  colorPalette="yellow"
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" fontSize="sm">
              Don&apos;t have an account?{" "}
              <Link as={NextLink} href={signUpPagePath()} color="yellow.500">
                Sign up
              </Link>
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Center>
  );
};

export default SignInPage;