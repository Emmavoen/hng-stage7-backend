Here is the complete, single-block `README.md`. Copy the entire code block below and paste it into your `README.md` file.

````markdown
# HNG Stage 7: Google Auth & Paystack Integration Service

This backend service is a robust implementation of **Task 1** for the HNG Stage 7 Backend track. It demonstrates secure **Google OAuth 2.0 authentication** and **Paystack payment processing** using **NestJS**.

The service allows users to authenticate via Google, creating a user profile in the database, and subsequently enables them to initiate and verify payments securely.

## 🚀 Features

* **Google Authentication:** Secure server-side OAuth flow (Login, Callback, User Creation).
* **Payment Processing:** Integration with Paystack to initialize transactions.
* **Transaction Verification:** On-demand status checks for payments.
* **Webhooks:** Handling real-time payment updates from Paystack.
* **Data Persistence:** PostgreSQL database using TypeORM for Users and Transactions.

## 🛠️ Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Authentication:** Passport.js (Google Strategy)
* **HTTP Client:** Axios

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/Emmavoen/hng-stage7-backend.git](https://github.com/Emmavoen/hng-stage7-backend.git)
cd hng-stage7-backend
````

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Configure Environment Variables

Create a `.env` file in the root directory and populate it with your credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=hng_stage7

# Google OAuth Credentials (console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Paystack Credentials (dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
```

### 4\. Run the Application

Ensure your PostgreSQL database is running.

```bash
# Development Mode
npm run start:dev

# Production Build
npm run build
npm run start:prod
```

-----

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/auth/google` | Initiates the Google OAuth login flow. Redirects user to Google. |
| `GET` | `/auth/google/callback` | Handles the return from Google, creates/updates the user, and returns user info. |

### 💳 Payments

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/payments/paystack/initiate` | Starts a new payment. Requires `{ "email": "...", "amount": 5000 }` in body. |
| `GET` | `/payments/:reference/status` | Checks the status of a specific transaction reference. |
| `POST` | `/payments/paystack/webhook` | Receives event updates from Paystack (e.g., `charge.success`). |

-----

## 🧪 Testing Workflow

To fully test the application flow, follow these steps:

1.  **Authenticate:**

      * Navigate to `http://localhost:3000/auth/google` in your browser.
      * Login with your Google account.
      * Copy the **email** from the JSON response.

2.  **Initiate Payment:**

      * Send a POST request to `/payments/paystack/initiate` using Postman/cURL.
      * Body:
        ```json
        {
          "email": "email_from_step_1@gmail.com",
          "amount": 5000
        }
        ```
      * Copy the **authorization\_url** and **reference** from the response.

3.  **Complete Payment:**

      * Open the `authorization_url` in your browser and complete the mock payment.

4.  **Verify Status:**

      * Send a GET request to `/payments/YOUR_REFERENCE/status`.
      * Confirm the status is `"success"`.

-----

## 👤 Author

**Emmanuel Eguavoen** - HNG Internship Stage 7

````

### How to push this update:

1.  Save the file.
2.  Run these commands:
    ```bash
    git add README.md
    git commit -m "Update README with project documentation"
    git push
    ```
````
