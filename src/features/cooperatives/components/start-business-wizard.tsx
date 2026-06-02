"use client";

import {
    Badge,
    Button,
    Card,
    Field,
    Heading,
    HStack,
    Input,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

const roles = [
    "BOARD_OF_DIRECTORS",
    "PRODUCTION",
    "CUSTOMER_SERVICE",
    "INVENTORY",
    "MARKETING",
    "ACCOUNTING",
];

const StartBusinessWizard = () => {
    const [step, setStep] = useState(0);

    const [form, setForm] = useState({
        name: "",
        description: "",
        salesDate: "",
        roles: [] as string[],
    });

    const progress = (step / 4) * 100;

    const toggleRole = (role: string) => {
        setForm((current) => ({
            ...current,
            roles: current.roles.includes(role)
                ? current.roles.filter((r) => r !== role)
                : [...current.roles, role],
        }));
    }

    return (
        <Card.Root maxW="560px" w="full" mx="auto" mt={12} shadow="lg">
            <Card.Body>
                <Stack gap={6}>
                    <Stack gap={2}>
                        <Heading size="lg">Start a Business</Heading>
                        <Text color="gray.600">
                            Create your lemonade stand business step by step.
                        </Text>

                        <Progress.Root value={progress}>
                            <Progress.Track>
                                <Progress.Range/>
                            </Progress.Track>
                        </Progress.Root>
                    </Stack>

                    {step === 0 && (
                        <Stack gap={5}>
                            <Field.Root required>
                                <Field.Label>Business Name</Field.Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Zest Friends Lemonade"
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Business Description</Field.Label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="We sell fresh lemonade with friends."
                                />
                            </Field.Root>
                        </Stack>
                    )}

                    {step === 1 && (
                        <Stack gap={4}>
                            <Heading size="sm">Select Your Roles</Heading>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                                {roles.map((role) => {
                                    const selected = form.roles.includes(role);

                                    return (
                                        <Button
                                            key={role}
                                            type="button"
                                            variant={selected ? "solid" : "outline"}
                                            colorPalette="yellow"
                                            onClick={() => toggleRole(role)}
                                        >
                                            {role.replaceAll("_", " ")}
                                        </Button>
                                    );
                                })}
                            </SimpleGrid>
                        </Stack>
                    )}

                    {step === 2 && (
                        <Stack gap={5}>
                            <Field.Root>
                                <Field.Label>First sales day</Field.Label>
                                <Input
                                    type="date"
                                    value={form.salesDate}
                                    onChange={(e) => setForm({ ...form, salesDate: e.target.value })}
                                />
                                <Field.HelperText>
                                This is the date your business will start selling lemonade. You can change it later if needed.
                                </Field.HelperText>
                            </Field.Root>       
                        </Stack>
                    )}

                    {step === 3 && (
                        <Stack gap={4}>
                            <Heading size="sm">Review Your Information</Heading>

                            <Text>
                                <strong>Name:</strong> {form.name || "Not entered"}
                            </Text>

                            <Text>
                                <strong>Description:</strong>{" "} {form.description || "Not entered"}
                            </Text>

                            <Text>
                                <strong>Sales day:</strong>{" "} {form.salesDate || "Not selected"}
                            </Text>

                            <HStack wrap="wrap">
                                {form.roles.map((role) => (
                                    <Badge key={role} colorPalette="yellow">
                                        {role.replaceAll("_", " ")}
                                    </Badge>
                                ))}
                            </HStack>
                        </Stack>
                    )}

                    <HStack justify="space-between">
                        <Button
                            variant="outline"
                            disabled={step === 0}
                            onClick={() => setStep((s) => s - 1)}
                        >
                            Back
                        </Button>

                        {step < 3 ? (
                            <Button
                                colorPalette="yellow"
                                onClick={() => setStep((s) => s + 1)}
                                disabled={step === 0 && (!form.name || !form.description)}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button colorPalette="yellow">
                                Create Business
                            </Button>
                        )}
                    </HStack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { StartBusinessWizard };