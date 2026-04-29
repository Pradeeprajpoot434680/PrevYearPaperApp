<div align="center">

# 📚 PrevYearPaperApp

**A platform for students to browse, upload, and access previous year university exam papers — all in one place.**

[![Live Site](https://img.shields.io/badge/Live%20Site-prevpaper.pdeep.store-blue?style=for-the-badge&logo=vercel)](https://prevpaper.pdeep.store/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## 🌐 Live Site

> **[https://prevpaper.pdeep.store/](https://prevpaper.pdeep.store/)**

---

## ✨ Features

- 🔍 **Browse papers** — search by department, program, semester, subject, exam type, and year
- 📤 **Upload papers** — students can submit PDFs or images (auto-compressed before upload)
- 🔐 **Authentication** — secure sign-up / log-in with email OTP verification
- ✅ **Admin moderation** — admins review and verify submitted papers before they go live
- 👤 **User profiles** — manage your account and view your upload history
- 📧 **Contact & support** — built-in contact form with email notifications
- 🌙 **Dark / light mode** — theme toggle powered by `next-themes`
- 📱 **Responsive design** — works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI / shadcn/ui](https://ui.shadcn.com/) | Accessible component primitives |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global state management |
| [TanStack Query](https://tanstack.com/query) | Server-state & data fetching |
| [React Hook Form + Zod](https://react-hook-form.com/) | Form handling & validation |
| [Axios](https://axios-http.com/) | HTTP client |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| [Express 5](https://expressjs.com/) | REST API framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Prisma ORM](https://www.prisma.io/) | Database access & migrations |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [JWT](https://jwt.io/) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Authentication & password hashing |
| [Cloudinary](https://cloudinary.com/) | File storage (PDFs & images) |
| [Nodemailer](https://nodemailer.com/) / [Resend](https://resend.com/) | Transactional emails |
| [Redis](https://redis.io/) | Caching & OTP storage |
| [Helmet](https://helmetjs.github.io/) + Rate Limiting | Security hardening |
| [Zod](https://zod.dev/) | Request validation |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- A running [PostgreSQL](https://www.postgresql.org/) instance
- A running [Redis](https://redis.io/) instance
- [Cloudinary](https://cloudinary.com/) account (for file uploads)
- [Resend](https://resend.com/) or SMTP credentials (for emails)

### 1. Clone the repository

```bash
git clone https://github.com/Pradeeprajpoot434680/PrevYearPaperApp.git
cd PrevYearPaperApp
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret"
REDIS_URL="redis://localhost:6379"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RESEND_API_KEY="your-resend-api-key"
PORT=3000
```

Run Prisma migrations and start the dev server:

```bash
npx prisma migrate deploy   # apply migrations
npm run dev                 # start with hot-reload (ts-node-dev)
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional — defaults to the hosted API):

```env
VITE_BACKEND_URL=http://localhost:3000
```

> **Note:** By default the frontend points to the hosted backend at `https://myprevyearpaperapp.onrender.com`. Update `src/lib/config.ts` or the env variable to point to your local instance.

Start the Vite dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Build for Production

**Frontend:**

```bash
cd frontend
npm run build      # outputs to frontend/dist/
npm run preview    # preview the production build locally
```

**Backend:**

```bash
cd backend
npm run build      # compiles TypeScript to backend/dist/
npm start          # runs the compiled output
```

---

## 📁 Project Structure

```
PrevYearPaperApp/
├── frontend/                  # React + Vite + TypeScript
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components (shadcn/ui wrappers, etc.)
│       ├── pages/             # Route-level page components
│       │   ├── DashBoard.tsx  # Paper browser
│       │   ├── AddPaper.tsx   # Paper upload form
│       │   ├── Admin.tsx      # Admin moderation panel
│       │   ├── AuthPage.tsx   # Login / Register
│       │   └── ...
│       ├── store/             # Zustand global state (auth, etc.)
│       ├── hooks/             # Custom React hooks
│       ├── data/              # Static data (university structure)
│       ├── config/            # App-wide configuration (team info, etc.)
│       ├── lib/               # Utilities & API base URL
│       └── types/             # Shared TypeScript type definitions
│
└── backend/                   # Express 5 + TypeScript + Prisma
    ├── prisma/
    │   ├── schema.prisma      # Database schema
    │   └── migrations/        # Prisma migration history
    └── src/
        ├── controllers/       # Route handler logic
        ├── routes/            # Express routers
        ├── utils/             # Helpers (rate limiter, JWT, etc.)
        └── seed/              # Database seed scripts
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please make sure your code compiles (`npm run build`) and follows the existing code style before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details, or refer to the [MIT License text](https://opensource.org/licenses/MIT).

> If a `LICENSE` file is not yet present in the repository, one will be added in a follow-up commit.

---

## 📬 Contact & Support

| | |
|---|---|
| **Maintainer** | Pradeep Kumar |
| **Email** | [pradeepkumar434680@gmail.com](mailto:pradeepkumar434680@gmail.com) |
| **Phone** | +91 8650152081 |
| **GitHub** | [@Pradeeprajpoot434680](https://github.com/Pradeeprajpoot434680) |
| **LinkedIn** | [pradeep-kumar-25798b2a0](https://www.linkedin.com/in/pradeep-kumar-25798b2a0) |

If you find a bug or have a feature request, please [open an issue](https://github.com/Pradeeprajpoot434680/PrevYearPaperApp/issues).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Pradeeprajpoot434680">Pradeep Kumar</a>
</div>
