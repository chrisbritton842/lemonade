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
        <Center minH="100vh" bg="gray.50" px={4}>
            <Card.Root maxW="420px" w="full" shadow="lg" borderRadius="xl">
                <Card.Body>
                    <Stack gap={6}>

                        {/* Header */}
                        <Stack gap={2} textAlign="center">
                            <Heading size="lg">Create Account</Heading>
                            <Text color="gray.600">
                                Sign up to start your business!
                            </Text>
                        </Stack>

                        {/* Form */}
                        <form action={action}>
                            <Stack gap={5}>

                                {/* Username */}
                                <Field.Root invalid={Boolean(errors.username)}>
                                    <Field.Label>Username</Field.Label>
                                    <Input
                                        name="username"
                                        placeholder="Enter your username"
                                        required
                                    />
                                    <Field.ErrorText>
                                        {errors.username?.[0]}
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* Password */}
                                <Field.Root invalid={Boolean(errors.password)}>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <Field.ErrorText>
                                        {errors.password?.[0]}
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    loading={pending}
                                    size="lg"
                                    colorPalette="yellow"
                                >
                                    Sign Up
                                </Button>

                            </Stack>
                        </form>

                        {/* Footer */}
                        <Text textAlign="center" fontSize="sm">
                            Already have an account?{" "}
                            <Link
                                as={NextLink}
                                href={signInPagePath()}
                                color="yellow.500"
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