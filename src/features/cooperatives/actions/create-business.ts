"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { commandCenterPagePath } from "@/paths";
import { signInPagePath } from "@/paths";

const schema = z.object({
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().min(5).max(200),
    salesDate: z.string().optional(),
    roles: z.string().optional(),
});

const slugify = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const createBusinessAction = async (formData: FormData) => {
    const user = await getCurrentUser();

    if (!user) {
        redirect(signInPagePath());
    }

    const parsed = schema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        salesDate: formData.get("salesDate"),
        roles: formData.get("roles"),
    });

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { name, description } = parsed.data;
    const roles = parsed.data.roles ? parsed.data.roles.split(",").filter(Boolean) : [];

    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    const coop = await prisma.cooperative.create({
        data: {
            name,
            description,
            slug,
            createdById: user.user.id,
            membership: {
                create: {
                    userId: user.user.id,
                    role: roles[0] ?? "BOARD_OF_DIRECTORS",
                },
            },
        },
    });

    redirect(commandCenterPagePath(coop.id));
};

export { createBusinessAction };
