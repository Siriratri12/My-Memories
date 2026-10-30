import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./authRoutes";
import { authMiddleware, AuthRequest } from "./middleware/auth";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ================================
// Swagger API Documentation
// ================================
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Memory App API",
    version: "2.0.0",
    description: "REST API สำหรับระบบบันทึกความทรงจำ พร้อม JWT Authentication",
  },
  servers: [{ url: "http://localhost:5001" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      MemoryInput: {
        type: "object",
        required: ["title", "description", "memoryDate"],
        properties: {
          title: { type: "string", example: "วันแรกที่สร้างเว็บ" },
          description: {
            type: "string",
            example: "วันนี้ได้เรียนรู้ Docker และ Vue",
          },
          memoryDate: {
            type: "string",
            format: "date-time",
            example: "2026-10-30T09:00:00.000Z",
          },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Test User" },
          email: {
            type: "string",
            format: "email",
            example: "test@example.com",
          },
          password: { type: "string", format: "password", minLength: 8 },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "test@example.com",
          },
          password: { type: "string", format: "password" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "สมัครสมาชิกใหม่",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": { description: "Registered successfully" },
          "400": { description: "Invalid input" },
          "409": { description: "Email already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "เข้าสู่ระบบและรับ JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "ดูข้อมูลผู้ใช้ที่เข้าสู่ระบบ",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User information" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/memories": {
      get: {
        tags: ["Memories"],
        summary: "ดึงความทรงจำของผู้ใช้และค้นหา",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Success" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Memories"],
        summary: "เพิ่มความทรงจำ",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MemoryInput" },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Invalid input" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/memories/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["Memories"],
        summary: "ดูรายละเอียดความทรงจำ",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Success" },
          "400": { description: "Invalid ID" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Memories"],
        summary: "แก้ไขความทรงจำ",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MemoryInput" },
            },
          },
        },
        responses: {
          "200": { description: "Updated" },
          "400": { description: "Invalid input" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
      delete: {
        tags: ["Memories"],
        summary: "ลบความทรงจำ",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Deleted" },
          "400": { description: "Invalid ID" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ================================
// Authentication Routes
// ================================
app.use("/api/auth", authRoutes);

// ================================
// Protect All Memory Routes
// ================================
app.use("/api/memories", authMiddleware);

// ================================
// Helpers
// ================================
function parseMemory(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const { title, description, memoryDate } = body as Record<string, unknown>;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    typeof memoryDate !== "string" ||
    !memoryDate.trim()
  ) {
    return null;
  }

  const date = new Date(memoryDate);

  if (Number.isNaN(date.getTime())) return null;

  return {
    title: title.trim(),
    description,
    memoryDate: date,
  };
}

function parseId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

// ================================
// GET ALL + SEARCH
// ================================
app.get("/api/memories", async (req: AuthRequest, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const memories = await prisma.memory.findMany({
      where: {
        userId: req.userId!,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(memories);
  } catch (error) {
    console.error("GET memories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// GET BY ID
// ================================
app.get("/api/memories/:id", async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const memory = await prisma.memory.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!memory) {
      res.status(404).json({ message: "Memory not found" });
      return;
    }

    res.json(memory);
  } catch (error) {
    console.error("GET memory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// CREATE
// ================================
app.post("/api/memories", async (req: AuthRequest, res) => {
  try {
    const data = parseMemory(req.body);

    if (!data) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }

    const memory = await prisma.memory.create({
      data: {
        ...data,
        userId: req.userId!,
      },
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error("CREATE memory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// UPDATE
// ================================
app.put("/api/memories/:id", async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id);
    const data = parseMemory(req.body);

    if (id === null || !data) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }

    const result = await prisma.memory.updateMany({
      where: {
        id,
        userId: req.userId!,
      },
      data,
    });

    if (result.count === 0) {
      res.status(404).json({ message: "Memory not found" });
      return;
    }

    const memory = await prisma.memory.findFirst({
      where: { id, userId: req.userId! },
    });

    res.json(memory);
  } catch (error) {
    console.error("UPDATE memory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// DELETE
// ================================
app.delete("/api/memories/:id", async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const result = await prisma.memory.deleteMany({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (result.count === 0) {
      res.status(404).json({ message: "Memory not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("DELETE memory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// Start Server
// ================================
const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
