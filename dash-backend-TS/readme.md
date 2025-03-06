
# Backend Setup for Your Project

This is the backend for the project, built with Express.js and TypeScript. Follow the steps below to set up the backend environment on your local machine.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or above) - You can download it from [here](https://nodejs.org/).
- **npm** - This comes bundled with Node.js.
- **Git** - If you don't have Git installed, get it from [here](https://git-scm.com/).

## Getting Started

### Step 1: Clone the repository

Clone the repository to your local machine.

```bash
git clone https://github.com/JeevanJoshi4434/Dash-2.0.git
cd Dash-2.0
git checkout backend
```

### Step 2: Install Dependencies

Use the following command to install all necessary dependencies.

```bash
npm install
```

This will install all the packages listed in the `package.json` file.

### Step 3: Set Up Environment Variables

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables (ensure to replace the values with your actual credentials):

```bash
# .env file

# Database configuration
MONGO_URI = mongodb://localhost:27017/farm

# JWT configuration
SALt=10

# Environment
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your-secret-key

# Port for the application to run on
PORT=3000
```

### Step 4: Run the Application

Once the environment variables are set up, you can start the backend server using:

```bash
npm start
```

By default, the application will run on [http://localhost:3000](http://localhost:3000).

To run the application in **development mode** with hot-reloading, use the following command:

```bash
npm run dev
```

### Step 5: Running Tests (Optional)

To run tests for your project, you can use:

```bash
npm test
```

Ensure that you have set up the testing environment and any necessary services.

### Step 6: Setup postman apis (Optional for development purposes)

To setup postman apis for development purposes, you can use posman exported file `Farmers.postman_collection.json`.

---

## API Documentation

You can find the API documentation at the following location:

- **API Documentation**: `/api/apis.md`

Please refer to this file for detailed information about the API endpoints, request/response formats, and error codes.

---

## Additional Notes

- **Authentication**: The backend uses JWT for authentication. Make sure you generate and pass the JWT token in the `Authorization` header when making requests to protected routes.
- **Database Setup**: Ensure you have a running PostgreSQL instance and that the database credentials are correctly set in the `.env` file.
- **Error Handling**: Any errors will be automatically handled by the global error handler. Check your terminal logs for detailed error information.

--