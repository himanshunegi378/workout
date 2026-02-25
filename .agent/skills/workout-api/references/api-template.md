# API Route Templates

## GET — List Resource

```ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const items = await prisma.workoutGroup.findMany({
            where: { user_id: userId },
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Failed to fetch items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
```

## GET — Single Resource with Dynamic Param

```ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupId } = await params;
        const userId = session.user.id;

        const group = await prisma.workoutGroup.findFirst({
            where: { id: groupId, user_id: userId },
            select: {
                id: true,
                name: true,
                // select only what UI needs
            },
        });

        if (!group) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error("Failed to fetch group:", error);
        return NextResponse.json(
            { error: "Failed to fetch group" },
            { status: 500 }
        );
    }
}
```

## POST — Create Resource

```ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description } = body;

        // Validate
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const item = await prisma.workoutGroup.create({
            data: {
                name: name.trim(),
                description: description || null,
                user_id: userId,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Failed to create item:", error);
        return NextResponse.json(
            { error: "Failed to create item" },
            { status: 500 }
        );
    }
}
```
