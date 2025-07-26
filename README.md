# SchoolHub

**SchoolHub** is an all-in-one school management platform designed to simplify and streamline administrative, academic, and communication tasks for educational institutions. It integrates features for managing students, teachers, courses, exams, and more, in a user-friendly and efficient way.

## 🚀 Current Development Status

### ✅ Completed Features

#### Backend (Express.js + TypeScript + Prisma + PostgreSQL)
- **Authentication System**
  - User registration and login with JWT tokens
  - Password reset functionality
  - Session management with IP and user agent tracking
  - Secure cookie handling

- **Role-Based Access Control (RBAC)**
  - Dynamic roles and permissions system
  - Permission groups for better organization
  - Audit logging for all actions

- **Student Management**
  - Complete CRUD operations for students
  - Student enrollment tracking
  - Guardian information management
  - Grade and section assignments
  - Advanced search and filtering

- **Database Schema**
  - Complete school management data model
  - Students, Teachers, Courses, Classes, Attendance, Grades
  - Comprehensive enums for statuses
  - Proper relationships and constraints

- **API Documentation**
  - Swagger/OpenAPI documentation
  - Comprehensive API endpoints
  - Input validation with Zod schemas

#### Frontend (Next.js 15 + TypeScript + Tailwind + shadcn/ui)
- **Modern UI/UX**
  - Dark/light theme support
  - Responsive design for all devices
  - Beautiful animations with Framer Motion
  - Comprehensive component library

- **Authentication Flow**
  - Professional login forms
  - Password reset functionality
  - Remember me functionality
  - Secure route protection

- **Dashboard System**
  - Comprehensive dashboard with statistics
  - Sidebar navigation with active states
  - Quick actions and recent activities
  - Mobile-responsive layout

- **Student Management UI**
  - Student directory with advanced search
  - Add/edit student forms with validation
  - Status tracking and filtering
  - Export functionality ready

- **Teacher Management UI**
  - Teacher directory and management
  - Qualification and specialization tracking
  - Experience and course load monitoring
  - Status management

### 🔄 In Progress Features
- Teacher CRUD operations (backend)
- Course management system
- Class scheduling
- Attendance tracking
- Grade management

### 📋 Planned Features
- Attendance management
- Grade book and report cards
- Timetable/Schedule management
- Fee management
- Parent portal
- Communication system
- Report generation
- Analytics dashboard

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with pgAdmin
- **Package Management**: Bun/npm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd schoolhub
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL with Docker
docker-compose up -d db

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start the development server
npm run dev
# or
bun run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs
- pgAdmin: http://localhost:5050

## 📁 Project Structure

```
schoolhub/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middlewares/          # Custom middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── schemas/             # Validation schemas
│   ├── utils/               # Utility functions
│   ├── prisma/              # Database schema and migrations
│   └── server.ts            # Main server file
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Dashboard pages
│   │   └── (landing)/       # Landing page
│   ├── components/          # Reusable components
│   │   └── ui/              # shadcn/ui components
│   └── utils/               # Frontend utilities
├── docs/                    # Documentation
└── docker-compose.yml       # Docker services
```

## 🔐 Default Credentials

For development and testing:

### Admin User
- Username: `admin`
- Password: `admin123`

### Test Student
- Username: `stu001`
- Password: `student123`

### Test Teacher
- Username: `tch001`
- Password: `teacher123`

## 🌟 Key Features Implemented

### 1. Modern Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Session management with device tracking
- Password reset with email tokens

### 2. Comprehensive Student Management
- Student registration with personal details
- Guardian information tracking
- Academic information (grade, section)
- Status management (Active, Graduated, etc.)
- Advanced search and filtering

### 3. Professional UI/UX
- Modern, responsive design
- Dark/light theme support
- Smooth animations and transitions
- Mobile-first approach
- Accessible components

### 4. Developer Experience
- Full TypeScript support
- Comprehensive API documentation
- Input validation and error handling
- Hot reload for development
- Containerized development environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### Students
- `GET /api/students` - Get all students with pagination
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats` - Get student statistics

### Roles & Permissions
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create new role
- `GET /api/permissions` - Get all permissions

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Core user authentication
- **Students**: Student-specific information
- **Teachers**: Teaching staff details
- **Courses**: Academic courses
- **Classes**: Scheduled class sessions
- **Enrollments**: Student-course relationships
- **Attendance**: Attendance tracking
- **Grades**: Academic performance records
- **Roles & Permissions**: Access control

## 🔄 Roadmap

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Student management
- 🔄 Teacher management
- 🔄 Course management

### Phase 2
- Class scheduling
- Attendance tracking
- Grade management
- Report generation

### Phase 3
- Parent portal
- Communication system
- Fee management
- Advanced analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from shadcn/ui
- Icons from Lucide React
- Database ORM by Prisma

---

**Happy Coding! 🎓📚**
