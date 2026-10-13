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
import { signUpAction } from "@/features/auth/actions/sign-up";
import { SignUpState } from "@/features/auth/actions/sign-up";
import { signInPagePath } from "@/paths";

const SignUpPage = () => {
    const [state, action, pending] = useActionState<SignUpState, FormData>(
        signUpAction,
        { errors: {}, success: false }
    );

    const errors = state.errors ?? {};

    return (
        <Center minH="100vh" bg="app.bg" color="app.text" px={4}>
            <Card.Root maxW="420px" w="full" bg="app.surface" borderColor="app.border" shadow="lg" borderRadius="xl">
                <Card.Body>
                    <Stack gap={6}>
                        <Stack gap={2} textAlign="center">
                            <Heading size="lg" color="app.text">Create Account</Heading>
                            <Text color="app.mutedText">
                                Sign up to start your business!
                            </Text>
                        </Stack>

                        <form action={action}>
                            <Stack gap={5}>
                                {errors.general?.[0] && (
                                    <Text color="red.500" fontSize="sm" textAlign="center">
                                        {errors.general[0]}
                                    </Text>
                                )}
                                <Field.Root invalid={Boolean(errors.username)}>
                                    <Field.Label>Username</Field.Label>
                                    <Input
                                        name="username"
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                    />
                                    <Field.ErrorText>
                                        {errors.username?.[0]}
                                    </Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={Boolean(errors.password)}>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <Field.ErrorText>
                                        {errors.password?.[0]}
                                    </Field.ErrorText>
                                </Field.Root>

                                <Button
                                    type="submit"
                                    loading={pending}
                                    size="lg"
                                    colorPalette="brand"
                                >
                                    Sign Up
                                </Button>
                            </Stack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="app.mutedText">
                            Already have an account?{" "}
                            <Link
                                as={NextLink}
                                href={signInPagePath()}
                                color="brand.fg"
                                fontWeight="semibold"
                            >
                                Sign In
                            </Link>
                        </Text>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </Center>
    );
};

export default SignUpPage;