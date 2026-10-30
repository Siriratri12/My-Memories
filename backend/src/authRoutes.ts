import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "./middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ถูกต้อง รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      res.status(409).json({
        message: "This email is already in use.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "ไม่สามารถสมัครสมาชิกได้",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({
        message: "กรุณากรอกอีเมลและรหัสผ่าน",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        message: "Incorrect email or password",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message: "JWT_SECRET is missing",
      });
      return;
    }

    const token = jwt.sign({}, secret, {
      subject: String(user.id),
      expiresIn: "2h",
      algorithm: "HS256",
    });

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "ไม่สามารถเข้าสู่ระบบได้",
    });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userId == null) {
      res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
    });
  }
});

// PUT /api/auth/me
// แก้ไขชื่อของผู้ใช้ที่เข้าสู่ระบบอยู่
router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userId == null) {
      res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
      return;
    }

    const { name } = req.body ?? {};

    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      res.status(400).json({
        message: "กรุณากรอกชื่อผู้ใช้ 1-100 ตัวอักษร",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true },
    });

    if (!existingUser) {
      res.status(401).json({
        message: "ไม่พบบัญชีผู้ใช้",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "ไม่สามารถอัปเดตโปรไฟล์ได้",
    });
  }
});

export default router;
