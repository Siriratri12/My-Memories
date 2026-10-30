# My Memories — ระบบบันทึกความจำ

My Memories เป็นเว็บแอปพลิเคชันสำหรับบันทึกและจัดการความจำ ผู้ใช้งานสามารถสมัครสมาชิก เข้าสู่ระบบ เพิ่ม แสดง ค้นหา แก้ไข และลบความจำ รวมถึงดูและแก้ไขข้อมูลโปรไฟล์ของตนเองได้

ระบบพัฒนาด้วย Vue 3 และ TypeScript สำหรับส่วน Frontend และ Node.js ร่วมกับ Express สำหรับส่วน Backend โดยใช้ PostgreSQL เป็นฐานข้อมูล Prisma สำหรับจัดการข้อมูล และ Docker Compose สำหรับรันระบบทั้งหมดร่วมกัน

## 1. คุณสมบัติของระบบ (Features)

### ระบบสมาชิกและการยืนยันตัวตน

- สมัครสมาชิกใหม่ (Register)
- ตรวจสอบอีเมลที่ถูกใช้ลงทะเบียนแล้ว
- เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน (Login)
- ยืนยันตัวตนด้วย JSON Web Token (JWT)
- ออกจากระบบ (Logout)
- จำกัดการเข้าถึง API ที่ต้องยืนยันตัวตน

### ระบบจัดการความจำ

- เพิ่มความจำใหม่ (Create)
- แสดงรายการความจำ (Read)
- ค้นหาความจำ (Search)
- แก้ไขความจำ (Update)
- ลบความจำ (Delete)
- แยกข้อมูลความจำตามบัญชีผู้ใช้งาน
- จัดเก็บข้อมูลถาวรใน PostgreSQL

### ระบบโปรไฟล์

- แสดงข้อมูลบัญชีผู้ใช้งาน
- แสดงชื่อผู้ใช้และอีเมล
- แก้ไขชื่อผู้ใช้งาน
- บันทึกการเปลี่ยนแปลงข้อมูลโปรไฟล์

## 2. เทคโนโลยีที่ใช้ (Technology Stack)

| ส่วนของระบบ       | เทคโนโลยี                    |
| ----------------- | ---------------------------- |
| Frontend          | Vue 3, TypeScript, Vite      |
| Backend           | Node.js, Express, TypeScript |
| Database          | PostgreSQL 16                |
| ORM               | Prisma                       |
| Authentication    | JSON Web Token (JWT)         |
| API Documentation | Swagger UI                   |
| Containerization  | Docker, Docker Compose       |
| Configuration     | Environment Variables (.env) |

## 3. โครงสร้างโปรเจกต์ (Project Structure)

```text
memory-app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── authRoutes.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AuthForm.vue
│   │   │   ├── Home.vue
│   │   │   ├── MemoryForm.vue
│   │   │   ├── MemoryList.vue
│   │   │   ├── ProfileForm.vue
│   │   │   └── Sidebar.vue
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   ├── memory.ts
│   │   │   └── user.ts
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env
└── README.md
```

หมายเหตุ: โครงสร้างด้านบนแสดงไฟล์สำคัญของโปรเจกต์ โดยไม่รวมโฟลเดอร์ที่เกิดจากการติดตั้งหรือ Build เช่น `node_modules` และ `dist`

## 4. สิ่งที่ต้องติดตั้งก่อนใช้งาน (Prerequisites)

ผู้ใช้งานควรติดตั้งโปรแกรมดังต่อไปนี้

- Docker
- Docker Compose
- Git (สำหรับ Clone โปรเจกต์ หากจัดเก็บไว้ใน Git Repository)

สามารถตรวจสอบการติดตั้ง Docker ได้ด้วยคำสั่ง

```bash
docker --version
docker compose version
```

## 5. การตั้งค่า Environment Variables

โปรเจกต์ใช้ไฟล์ `.env` สำหรับจัดเก็บค่าการตั้งค่าของระบบ โดยมีตำแหน่งไฟล์ดังนี้

```text
memory-app/.env
memory-app/backend/.env
```

ค่าการตั้งค่าที่เกี่ยวข้องกับระบบอาจประกอบด้วยการเชื่อมต่อฐานข้อมูล PostgreSQL, JWT Secret และค่ากำหนดอื่น ๆ ของ Backend

ก่อนเริ่มระบบต้องตรวจสอบว่ามี Environment Variables ที่จำเป็นครบถ้วน และค่าที่กำหนดสอดคล้องกับ `docker-compose.yml` และการตั้งค่า Backend

**ข้อควรระวัง:** ไม่ควรเผยแพร่ไฟล์ `.env` ที่มีรหัสผ่านหรือข้อมูลลับลงใน Public Repository ควรจัดเตรียมไฟล์ตัวอย่าง `.env.example` สำหรับผู้ที่ต้องการติดตั้งโปรเจกต์

## 6. วิธีติดตั้งและเริ่มต้นใช้งาน (Installation & Setup)

### ขั้นตอนที่ 1: เปิดโฟลเดอร์โปรเจกต์

เปิด Terminal และเข้าไปยังโฟลเดอร์หลักของโปรเจกต์

```bash
cd memory-app
```

### ขั้นตอนที่ 2: ตรวจสอบ Environment Variables

ตรวจสอบไฟล์ `.env` และการตั้งค่าที่จำเป็นก่อนเริ่มระบบ

### ขั้นตอนที่ 3: Build และรัน Docker Compose

```bash
docker compose up -d --build
```

คำสั่งนี้ใช้สำหรับ Build และเริ่มต้น Services ของระบบ ได้แก่

- `frontend` — ส่วนติดต่อผู้ใช้งาน
- `backend` — REST API
- `db` — PostgreSQL Database

### ขั้นตอนที่ 4: ตรวจสอบสถานะ Container

```bash
docker compose ps
```

ควรพบว่า Frontend, Backend และ Database ทำงานอยู่ และ PostgreSQL อยู่ในสถานะ Healthy

## 7. การเข้าใช้งานระบบ

หลังจาก Docker Compose ทำงานสำเร็จ สามารถเข้าใช้งานผ่าน URL ดังต่อไปนี้

| บริการ                    | URL                             |
| ------------------------- | ------------------------------- |
| Frontend                  | http://localhost:5174           |
| Backend API               | http://localhost:5001           |
| Swagger API Documentation | http://localhost:5001/api-docs/ |

### วิธีใช้งานเบื้องต้น

1. เปิดหน้าเว็บไซต์ My Memories
2. เลือก Register เพื่อสมัครสมาชิกใหม่
3. กรอกชื่อผู้ใช้งาน อีเมล และรหัสผ่าน
4. เข้าสู่ระบบด้วยบัญชีที่สมัครไว้
5. เพิ่มความจำโดยระบุชื่อ วันที่ และรายละเอียด
6. ค้นหา แก้ไข หรือลบความจำตามต้องการ
7. เปิดหน้า Profile เพื่อดูหรือแก้ไขชื่อผู้ใช้งาน
8. กด Sign Out เมื่อต้องการออกจากระบบ

## 8. API Documentation

ระบบมีเอกสาร REST API ผ่าน Swagger UI

เปิดใช้งานได้ที่

http://localhost:5001/api-docs/

### Authentication API

| Method | Endpoint             | รายละเอียด                   |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | สมัครสมาชิกใหม่              |
| POST   | `/api/auth/login`    | เข้าสู่ระบบและรับ JWT        |
| GET    | `/api/auth/me`       | ดูข้อมูลผู้ใช้ที่เข้าสู่ระบบ |

### Memory API

| Method | Endpoint             | รายละเอียด            |
| ------ | -------------------- | --------------------- |
| GET    | `/api/memories`      | แสดงและค้นหาความจำ |
| POST   | `/api/memories`      | เพิ่มความจำ        |
| GET    | `/api/memories/{id}` | ดูรายละเอียดความจำ |
| PUT    | `/api/memories/{id}` | แก้ไขความจำ        |
| DELETE | `/api/memories/{id}` | ลบความจำ           |

### การยืนยันตัวตนผ่าน Swagger

สำหรับ API ที่ต้องยืนยันตัวตน สามารถทดสอบได้โดย

1. เปิด `POST /api/auth/login`
2. เข้าสู่ระบบด้วยบัญชีผู้ใช้
3. รับ JWT Token จาก Response
4. กดปุ่ม Authorize ใน Swagger UI
5. ระบุ Token ตามรูปแบบที่ Swagger กำหนด
6. เรียกใช้งาน API ที่ต้องยืนยันตัวตน

หากเรียก `GET /api/auth/me` โดยไม่มี Token ระบบจะตอบกลับ HTTP `401 Unauthorized`

## 9. ฐานข้อมูล (Database)

ระบบใช้ PostgreSQL 16 สำหรับจัดเก็บข้อมูล โดยใช้ Prisma ในการจัดการโครงสร้างฐานข้อมูล

จากการตรวจสอบ พบตารางหลักดังนี้

| ตาราง                | รายละเอียด                      |
| -------------------- | ------------------------------- |
| `User`               | ข้อมูลบัญชีผู้ใช้งาน            |
| `Memory`             | ข้อมูลความจำ                 |
| `_prisma_migrations` | ประวัติการ Migration ของ Prisma |

### โครงสร้างข้อมูลความจำ

ตาราง `Memory` ประกอบด้วยคอลัมน์สำคัญ ได้แก่

- `id` — รหัสความจำ
- `title` — ชื่อความจำ
- `description` — รายละเอียด
- `memoryDate` — วันที่ของความจำ
- `createdAt` — วันที่สร้างข้อมูล
- `updatedAt` — วันที่แก้ไขข้อมูล
- `userId` — รหัสผู้ใช้งานที่เกี่ยวข้อง

### การตรวจสอบฐานข้อมูล

แสดงตารางทั้งหมด

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt"'
```

ตรวจสอบจำนวนข้อมูลความจำ

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) FROM \"Memory\";"'
```

ตรวจสอบจำนวนสมาชิก

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) FROM \"User\";"'
```

## 10. ผลการทดสอบระบบ (Testing Results)

มีการทดสอบการทำงานของระบบด้วยวิธี Manual Functional Testing และตรวจสอบผ่าน Swagger UI, Docker Compose และ PostgreSQL

| Test Case | รายการทดสอบ                                 | ผล   |
| --------- | ------------------------------------------- | ---- |
| TC-01     | เพิ่มความจำ                              | PASS |
| TC-02     | แสดงรายการความจำ                         | PASS |
| TC-03     | ค้นหาความจำ                              | PASS |
| TC-04     | ตรวจสอบข้อมูลหลังรีเฟรช                     | PASS |
| TC-05     | แก้ไขความจำ                              | PASS |
| TC-06     | ลบความจำ                                 | PASS |
| TC-07     | เข้าสู่ระบบและตรวจสอบรหัสผ่านผิด            | PASS |
| TC-08     | สมัครสมาชิกและป้องกันอีเมลซ้ำ               | PASS |
| TC-09     | แสดงและแก้ไขโปรไฟล์                         | PASS |
| TC-10     | ตรวจสอบ JWT Authorization                   | PASS |
| TC-11     | ตรวจสอบ PostgreSQL                          | PASS |
| TC-12     | ตรวจสอบ Docker Compose และโครงสร้างโปรเจกต์ | PASS |

**สรุปผล:** ระบบผ่านการทดสอบตาม Test Cases ทั้ง 12 รายการที่ดำเนินการ โดยเป็นผลจากการทดสอบด้วยตนเอง ไม่ใช่การทดสอบอัตโนมัติหรือการรับรองความปลอดภัยทั้งหมด

## 11. คำสั่ง Docker ที่ใช้บ่อย

### เริ่มต้นและ Build ระบบ

```bash
docker compose up -d --build
```

### ตรวจสอบ Container

```bash
docker compose ps
```

### ดู Logs ทั้งหมด

```bash
docker compose logs -f
```

### ดู Logs ของ Backend

```bash
docker compose logs -f backend
```

### หยุดระบบ

```bash
docker compose down
```

### เริ่มระบบที่หยุดไว้

```bash
docker compose up -d
```

**ข้อควรระวัง:** หลีกเลี่ยงการใช้ `docker compose down -v` หากไม่ต้องการลบ Docker Volumes ที่อาจมีข้อมูลฐานข้อมูลอยู่

## 12. สรุปMy Memories

My Memories เป็นเว็บแอปพลิเคชันแบบ Full Stack ที่พัฒนาขึ้นเพื่อจัดการความจำ รองรับการสมัครสมาชิก การเข้าสู่ระบบด้วย JWT การจัดการข้อมูลความจำแบบ CRUD การจัดการโปรไฟล์ และการจัดเก็บข้อมูลลง PostgreSQL

ระบบสามารถเริ่มใช้งานผ่าน Docker Compose และมี Swagger UI สำหรับตรวจสอบและทดสอบ REST API ช่วยให้สามารถติดตั้ง ทดสอบ และพัฒนาระบบต่อยอดได้สะดวก
