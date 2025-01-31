# SchoolHub Backend

Welcome to the backend of the SchoolHub project! SchoolHub is a platform that provides a comprehensive management system for schools. The backend of SchoolHub handles all the business logic, user authentication, data storage, and more, ensuring that the platform runs smoothly and efficiently.

## Features

- **User Authentication:** Secure login and registration with JWT tokens.
- **Role-Based Access Control:** Role-based access control for different user roles (e.g., admin, teacher, student).

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
    bun run dev
    # Or if using yarn
    yarn dev
    ```

2. The backend will be available at `http://localhost:5000`.

## API Endpoints

- **GET /**: Default, returns a simple message.


## Running Tests

To run the tests for the backend:

```bash
bun run start
# Or if using yarn
yarn start
```
