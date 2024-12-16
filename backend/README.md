# SchoolHub Backend

Welcome to the backend of the SchoolHub project! SchoolHub is a platform that provides a comprehensive management system for schools. The backend of SchoolHub handles all the business logic, user authentication, data storage, and more, ensuring that the platform runs smoothly and efficiently.

## Features

- **User Authentication:** Secure login and registration with JWT tokens.
- **Role-based Access Control:** Different roles (e.g., student, teacher, admin, parent) with access to specific features.
- **School Data Management:** Manage students, courses, grades, and schedules.
- **Finance Management:** Accessible by the registrar for managing financial information.
- **Dynamic Theming:** Support for light and dark mode.

## Tech Stack

- **Backend Framework:** Node.js with Express
- **Language:** TypeScript
- **Database:** Prisma ORM(PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Environment Management:** Node.js and bun

## Setup

### Prerequisites

- Node.js 14.x or higher
- bun or npm

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/haxurn/schoolhub.git
    ```

2. Navigate into the project directory:

    ```bash
    cd schoolhub && cd backend
    ```

3. Install the required dependencies:

    ```bash
    bun install
    # Or if using npm
    npm install
    ```

4. Configure environment variables for sensitive data (e.g., database URI, JWT secret):

    - Copy the `.env.sample` file to `.env`:

        ```bash
        cp .env.sample .env
        ```

    - Edit `.env` and add the appropriate values for your environment.

### Running the Backend

1. Start the development server:

    ```bash
    npm run dev
    # Or if using yarn
    yarn dev
    ```

2. The backend will be available at `http://localhost:5000`.

## API Endpoints

- **POST /api/auth/login**: Authenticate a user and receive a JWT token.
- **POST /api/auth/register**: Register a new user.
- **GET /api/users**: Retrieve a list of users (restricted by roles).
- **GET /api/courses**: Retrieve all available courses.
- **POST /api/grades**: Submit grades for students.
- **GET /api/finance**: Retrieve financial information (restricted to the registrar role).

## Running Tests

To run the tests for the backend:

```bash
npm run test
# Or if using yarn
yarn test
