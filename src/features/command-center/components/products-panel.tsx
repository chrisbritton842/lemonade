import {
    Badge,
    Card,
    Heading,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import type { CommandCenterProduct } from "@/features/command-center/types";

type ProductsPanelProps = {
    products: CommandCenterProduct[];
};

const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(priceCents / 100);
};

const ProductsPanel = ({ products }: ProductsPanelProps) => {
    const activeProducts = products.filter((product) => product.isActive);

    return (
        <Card.Root>
            <Card.Body>
                <Stack gap={5}>
                    <Stack gap={1}>
                        <Heading size="md">Products</Heading>
                        <Text color="gray.600" fontSize="sm">
                            These are the items your business currently sells.
                        </Text>
                    </Stack>

                    {activeProducts.length === 0 ? (
                        <Text color="gray.600" fontSize="sm">
                            No products yet. Members can propose a product in the proposals panel.
                        </Text>
                        ) : (
                            <Stack gap={3}>
                                {activeProducts.map((product) => (
                                    <Card.Root key={product.id} variant="subtle">
                                        <Card.Body>
                                            <HStack justify="space-between" align="start" gap={3}>
                                                <Stack gap={1}>
                                                    <Text fontWeight="semibold">{product.name}</Text>

                                                    {product.description && (
                                                        <Text color="gray.600" fontSize="sm">
                                                            {product.description}
                                                        </Text>
                                                    )}
                                                </Stack>

                                                <Badge colorPalette="green" fontSize="sm">
                                                    {formatPrice(product.priceCents)}
                                                </Badge>
                                            </HStack>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </Stack>
                        )}
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export { ProductsPanel };