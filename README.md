# 🎓 LMS Platform

A full-featured **Learning Management System** (LMS) built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **shadcn/ui**.  
Perfect for creating, editing, and managing courses — with a clean admin interface and modern stack.

> ✅ Made with ❤️ by [Abraham Elebute](https://github.com/AbrahamElebute)  
> 🙌 Inspired by this awesome tutorial: [Build an LMS with Next.js App Router](https://youtu.be/xqoYkX4hfwg?si=KAZLNTgqavTuBFgC) by **@Jan Marshal**

---

## 📸 Preview

<img src="https://i.ibb.co/s9PHg5pM/Screenshot-433.png" alt="LMS Platform Preview" width="100%" />

---

## ✨ Features

- 📚 Admin: Create, edit, publish courses
- 🧩 Modular form-based course builder
- 👤 Authentication & middleware protection
- ⚙️ Prisma ORM integration with SQLite/PostgreSQL
- 🌈 Beautiful UI with TailwindCSS & shadcn/ui
- 🔐 Form validation using Zod
- 📁 File uploads for course images (coming soon)
- 🧠 Organized codebase using App Router

---

## 🏗️ Project Structure

app
 ┣ (auth)
 ┃ ┣ login
 ┃ ┃ ┣ _components
 ┃ ┃ ┃ ┗ LoginForm.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ verify-request
 ┃ ┃ ┗ page.tsx
 ┃ ┗ layout.tsx
 ┣ (main)
 ┃ ┣ _components
 ┃ ┃ ┣ Navbar.tsx
 ┃ ┃ ┗ UserDropdown.tsx
 ┃ ┣ layout.tsx
 ┃ ┗ page.tsx
 ┣ admin
 ┃ ┣ courses
 ┃ ┃ ┣ create
 ┃ ┃ ┃ ┣ actions.ts
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ [courseId]
 ┃ ┃ ┃ ┗ edit
 ┃ ┃ ┃ ┃ ┣ _components
 ┃ ┃ ┃ ┃ ┃ ┣ CourseStructure.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ EditCoursesForm.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ SortableItem.tsx
 ┃ ┃ ┃ ┃ ┣ actions.ts
 ┃ ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ _components
 ┃ ┃ ┃ ┗ AdminCourseCard.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ data.json
 ┃ ┣ layout.tsx
 ┃ ┗ page.tsx
 ┣ api
 ┃ ┣ auth
 ┃ ┃ ┗ [...all]
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┣ s3
 ┃ ┃ ┣ delete
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┗ upload
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┗ send
 ┃ ┃ ┗ route.ts
 ┣ data
 ┃ ┗ admin
 ┃ ┃ ┣ admin-get-course.ts
 ┃ ┃ ┣ admin-get-courses.ts
 ┃ ┃ ┗ require-admin.ts
 ┣ not-admin
 ┃ ┗ page.tsx
 ┣ globals.css
 ┗ layout.tsx



- `app/admin/courses/`: Core logic for creating & editing courses
- `components/`: UI components (cards, buttons, form sections)
- `prisma/`: Prisma schema and seed
- `lib/`: Utilities like auth, db client
- `types/`: TypeScript shared types
- `app/api/`: Route handlers (REST-like API)

---

## 📦 Tech Stack

| Technology     | Purpose                     |
|----------------|-----------------------------|
| Next.js 14     | React framework              |
| TypeScript     | Static typing                |
| TailwindCSS    | Utility-first CSS styling    |
| Prisma         | ORM (Object Relational Mapping) |
| Zod            | Schema validation            |
| shadcn/ui      | Beautiful UI components      |
| SQLite / Postgres | Local or production DB     |

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/AbrahamElebute/LMS-Platform.git
cd LMS-Platform

2. Install Dependencies
bash
Copy
Edit
pnpm install
# or yarn / npm
3. Configure .env
Create a .env file from the .env.example and configure your database:

env
Copy
Edit
DATABASE_URL="file:./dev.db" # For SQLite (dev)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
4. Set up the Database
bash
Copy
Edit
pnpm prisma migrate dev --name init
pnpm prisma db seed
5. Run the Development Server
bash
Copy
Edit
pnpm dev
Visit http://localhost:3000

🔧 Course Management
Create or edit courses at /admin/courses

Add a title, description, price, category, image

Publish or unpublish courses

More features like video upload, quiz builder, etc. coming soon!

🙌 Shoutout & Credits
Massive thanks to @janmarshalcoding for the excellent walkthrough!

📺 Watch the full tutorial here:
👉 Build a full LMS with Next.js & Prisma

⭐ Support
If you find this project useful:

Leave a ⭐ on this repo

Fork and build on top of it

Tag me if you create something cool!

📫 Connect
GitHub: AbrahamElebute
Email: abrahamelebute@gmail.com
