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
import { createBusinessAction } from "../actions/create-business";

const roles = [
    "BOARD_OF_DIRECTORS",
    "PRODUCTION",
    "CUSTOMER_SERVICE",
    "INVENTORY",
    "MARKETING",
    "ACCOUNTING",
] as const;

type BusinessRole = (typeof roles)[number];

const roleLabels: Record<BusinessRole, string> = {
    BOARD_OF_DIRECTORS: "Board of Directors",
    PRODUCTION: "Production",
    CUSTOMER_SERVICE: "Customer Service",
    INVENTORY: "Inventory",
    MARKETING: "Marketing",
    ACCOUNTING: "Accounting",
};

const inputStyles = {
    bg: "app.surface",
    color: "app.text",
    borderColor: "app.border",
    focusRingColor: "brand.focusRing",
    _placeholder: {
        color: "app.mutedText",
    },
} as const;

const TOTAL_STEPS = 4;

const StartBusinessWizard = () => {
    const [step, setStep] = useState(0);

    const [form, setForm] = useState({
        name: "",
        description: "",
        salesDate: "",
        roles: [] as BusinessRole[],
    });

    const progress = ((step + 1) / TOTAL_STEPS) * 100;

    const toggleRole = (role: BusinessRole) => {
        setForm((current) => ({
            ...current,
            roles: current.roles.includes(role)
                ? current.roles.filter((r) => r !== role)
                : [...current.roles, role],
        }));
    };

    const canContinue = 
        step !== 0 ||
        (form.name.trim().length > 0 &&
            form.description.trim().length > 0);

    return (
        <Card.Root
            maxW="560px"
            w="full"
            mx="auto"
            mt={12}
            bg="app.surface"
            borderColor="app.border"
            borderWidth="1px"
            borderRadius="xl"
            shadow="sm"
        >
            <Card.Body p={{ base: 5, sm: 7 }}>
                <Stack gap={6}>
                    <Stack gap={3}>
                        <Heading size="lg" color="app.text">Start a Business</Heading>
                        <Text color="app.mutedText">
                            Create your lemonade stand business step by step.
                        </Text>

                        <Stack gap={2}>
                            <HStack justify="space-between">
                                <Text
                                    color="brand.fg"
                                    fontSize="sm"
                                    fontWeight="medium"
                                >
                                    Step {step + 1} of {TOTAL_STEPS}
                                </Text>

                                <Text color="app.mutedText" fontSize="sm">
                                    {Math.round(progress)}% complete
                                </Text>
                            </HStack>

                            <Progress.Root
                                value={progress}
                                colorPalette="brand"
                                size="sm"
                            >
                                <Progress.Track bg="slate.100">
                                    <Progress.Range bg="brand.solid" />
                                </Progress.Track>
                            </Progress.Root>
                        </Stack>  
                    </Stack>

                    {step === 0 && (
                        <Stack gap={5}>
                            <Field.Root required>
                                <Field.Label color="app.text">Business Name</Field.Label>
                                <Input
                                    name="businessName"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Zest Friends Lemonade"
                                    maxLength={80}
                                    required
                                    {...inputStyles}
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label color="app.text">Business Description</Field.Label>
                                <Textarea
                                    name="businessDescription"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="We sell fresh lemonade with friends."
                                    rows={4}
                                    maxLength={300}
                                    required
                                    {...inputStyles}
                                />
                            </Field.Root>
                        </Stack>
                    )}

                    {step === 1 && (
                        <Stack gap={4}>
                            <Stack gap={1}>
                                <Heading size="sm" color="app.text">
                                    Select Your Roles
                                </Heading>

                                <Text color="app.mutedText" fontSize="sm">
                                    Choose the roles you want to have in your business.
                                </Text>
                            </Stack>

                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                                {roles.map((role) => {
                                    const selected = form.roles.includes(role);

                                    return (
                                        <Button
                                            key={role}
                                            type="button"
                                            variant={selected ? "solid" : "outline"}
                                            colorPalette="brand"
                                            bg={selected ? "brand.solid" : "app.surface"}
                                            color={selected ? "white" : "app.text"}
                                            borderColor={
                                                selected ? "brand.solid" : "app.border"
                                            }
                                            borderRadius="lg"
                                            h="auto"
                                            minH="48px"
                                            py={3}
                                            px={3}
                                            whiteSpace="normal"
                                            aria-pressed={selected}
                                            _hover={
                                                selected
                                                    ? { bg: "sky.600" }
                                                    : {
                                                        bg: "brand.subtle",
                                                        borderColor: "brand.emphasized",
                                                    }
                                            }
                                            onClick={() => toggleRole(role)}
                                        >
                                            {roleLabels[role]}
                                        </Button>
                                    );
                                })}
                            </SimpleGrid>
                        </Stack>
                    )}

                    {step === 2 && (
                        <Stack gap={5}>
                            <Field.Root>
                                <Field.Label color="app.text">First Sales Day</Field.Label>
                                <Input
                                    type="date"
                                    value={form.salesDate}
                                    onChange={(e) => setForm({ ...form, salesDate: e.target.value })}
                                    {...inputStyles}
                                />
                                <Field.HelperText color="app.mutedText">
                                This is the date your business will start selling lemonade. You can change it later if needed.
                                </Field.HelperText>
                            </Field.Root>       
                        </Stack>
                    )}

                    {step === 3 && (
                        <form action={createBusinessAction}>
                          <Stack gap={5}>
                            <Heading size="sm" color="app.text">Review Your Information</Heading>

                            <Stack gap={3}>
                                <Stack gap={1}>
                                    <Text
                                        fontWeight="semibold"
                                        color="app.text"
                                        fontSize="sm"
                                    >
                                        Business Name
                                    </Text>

                                    <Text color="app.mutedText">
                                        {form.name || "Not entered"}
                                    </Text>
                                </Stack>

                                <Stack gap={1}>
                                    <Text
                                        fontWeight="semibold"
                                        color="app.text"
                                        fontSize="sm"
                                    >
                                        Business Description
                                    </Text>

                                    <Text
                                        color="app.mutedText"
                                        whiteSpace="pre-wrap"
                                        overflowWrap="anywhere"
                                    >
                                        {form.description || "Not entered"}
                                    </Text>
                                </Stack>

                                <Stack gap={1}>
                                    <Text
                                        fontWeight="semibold"
                                        color="app.text"
                                        fontSize="sm"
                                    >
                                        First Sales Day
                                    </Text>

                                    <Text color="app.mutedText">
                                        {form.salesDate || "Not selected"}
                                    </Text>
                                </Stack>

                                <Stack gap={2}>
                                    <Text
                                        fontWeight="semibold"
                                        color="app.text"
                                        fontSize="sm"
                                    >
                                        Selected Roles
                                    </Text>

                                    {form.roles.length === 0 ? (
                                        <Text color="app.mutedText">
                                            No roles selected.
                                        </Text>
                                    ) : (
                                        <HStack gap={2} wrap="wrap">
                                            {form.roles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    colorPalette="brand"
                                                    variant="subtle"
                                                >
                                                    {roleLabels[role]}
                                                </Badge>
                                            ))}
                                        </HStack>
                                    )}
                                </Stack>
                            </Stack>

                            <input type="hidden" name="name" value={form.name} />
                            <input type="hidden" name="description" value={form.description} />
                            <input type="hidden" name="salesDate" value={form.salesDate} />
                            <input type="hidden" name="roles" value={JSON.stringify(form.roles)} />

                            <HStack
                                justify="space-between"
                                gap={3}
                                wrap="wrap"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    colorPalette="brand"
                                    onClick={() => setStep((s) => s - 1)}
                                >
                                    Back
                                </Button>

                                <Button type="submit" colorPalette="brand">
                                    Create Business
                                </Button>
                            </HStack>
                          </Stack>
                        </form>
                    )}

                    {step < 3 && (
                        <HStack justify="space-between" gap={3}>
                            <Button
                                type="button"
                                variant="outline"
                                colorPalette="brand"
                                disabled={step === 0}
                                onClick={() => setStep((s) => s - 1)}
                            >
                                Back
                            </Button>

                            <Button
                                type="button"
                                colorPalette="brand"
                                disabled={!canContinue}
                                onClick={() => setStep((s) => s + 1)}
                            >
                                Continue
                            </Button>
                        </HStack>
                    )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { StartBusinessWizard };