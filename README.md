# Backend - MERN Stack Project

## Overview

This is the backend for a PERN stack application, built using **Node.js**, **Express.js**, and **PostgreSQL** for data storage. The backend handles user authentication, manage businesses, types, and exposes RESTful routes that the front-end can interact with.

---

## Features

- **User Authentication** using **JWT** (JSON Web Token)
- **CRUD Operations** for [entities like businesses, types, etc.]
- Secure routes protected by JWT authentication

---

## Tech Stack

- **Node.js** (runtime)
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **JWT** (authentication)

---

## Prerequisites

Before running this project, ensure you have the following installed on your local machine:

- **PostgreSQL** (Database)
- **Node.js** (Runtime)

You can download them from the official websites:

- [PostgreSQL download](https://www.postgresql.org/download/)
- [Node.js download](https://nodejs.org/en/download/)

---

## Installation

Follow these steps to get the backend up and running:

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   ```

2. **Navigate to the backend directory:**

   ```bash
   cd <backend-folder>
   ```

3. **Install dependencies:**
   Run the following command to install all the required dependencies:

   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```bash
   DB_USER=your-postgresql-username
   DB_HOST=localhost
   DB_DATABASE=your-database-name
   DB_PASSWORD=your-database-password
   DB_PORT=5432
   PORT=your-preferred-port
   JWT_SECRET=your-secret-key

```

5. **Run the app:**
   Start the server with the following command:
   ```bash
   npm start
   ```


---

## Testing

If you have tests set up, you can run them with:

```bash
npm run test
```

---
