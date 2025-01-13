```bash
schoolhub/
│
├── frontend/                       # All frontend-related files
│   ├── components/                 # Reusable UI components (e.g., buttons, form fields)
│   ├── pages/                      # Page components (Next.js pages or React pages)
│   ├── styles/                     # TailwindCSS, global styles, and themes
│   ├── utils/                      # Helper functions or custom hooks (e.g., for authentication)
│   ├── public/                     # Static files like images, fonts, etc.
│   ├── .env.local                  # Frontend-specific environment variables
│   ├── next.config.js              # Next.js configuration file (if applicable)
│   ├── tsconfig.json               # TypeScript configuration file
│   └── package.json                # Frontend dependencies and scripts
│
├── backend/                        # All backend-related files
│   ├── controllers/                # Route handlers for authentication and other business logic
│   ├── models/                     # Prisma models and database setup
│   ├── services/                   # Helper services (e.g., JWT generation, password hashing)
│   ├── routes/                     # API routes (e.g., for login, registration)
│   ├── middlewares/                # Authentication middleware (JWT verification, role-based access)
│   ├── utils/                      # Helper functions for backend (e.g., logging)
│   ├── config/                     # Configurations for environment variables, DB setup, etc.
│   ├── docs/                       # Documentation files
│   ├── types/                      # TypeScript types (e.g., for request and response data)
│   ├── validators/                 # Validation schemas for request data
│   ├── prisma/                     # Prisma client and migrations
│   ├── .env                        # Backend-specific environment variables
│   ├── tsconfig.json               # TypeScript configuration for backend
│   ├── server.ts                   # Main backend server file (e.g., Express or Fastify app)
│   ├── package.json                # Backend dependencies and scripts
│   └── prisma.schema               # Prisma schema for database setup
│
├── .gitignore                      # Git ignore file
├── README.md                       # Project overview and setup instructions
└── docker-compose.yml              # (Optional) Docker configuration for both frontend and backend


```