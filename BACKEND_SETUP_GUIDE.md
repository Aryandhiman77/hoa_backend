# HOA Backend Setup and Configuration Guide

This guide explains how to install this backend in a new folder, configure MongoDB and email, create the first administrator, control upload limits, enable administrator OTP verification, and verify the installation.

## 1. Prerequisites

Install or obtain the following before starting:

- Node.js 22.x (the backend has been verified with Node.js 22.14.0)
- npm 10.x or a compatible version
- A MongoDB database:
  - MongoDB Atlas, or
  - a self-hosted MongoDB server
- A Gmail or Google Workspace mailbox if email and admin OTP are required
- The backend source files

Check Node.js and npm:

```bash
node --version
npm --version
```

## 2. Create the Backend Folder

Create a new folder and enter it:

```bash
mkdir hoa-backend
cd hoa-backend
```

Copy the backend source into this folder. The resulting folder must contain at least:

```text
hoa-backend/
├── index.js
├── package.json
├── package-lock.json
├── env.example
├── public/
│   ├── hoa-logo.png
│   └── uploads/
└── src/
```

If Git access is provided, cloning the repository can replace the create-and-copy steps:

```bash
git clone <BACKEND_REPOSITORY_URL> hoa-backend
cd hoa-backend
```

## 3. Install Dependencies

For a clean, repeatable installation using `package-lock.json`, run:

```bash
npm ci
```

Use `npm install` instead only when intentionally updating dependencies or when no lock file is supplied:

```bash
npm install
```

Do not copy an old `node_modules` folder from another server or computer.

## 4. Create and Configure `.env`

Create `.env` from the supplied example:

```bash
cp env.example .env
```

Use values similar to the following:

```dotenv
NODE_ENV=development
APP_URL=http://localhost:3000
PORT=3000

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRY=24h
AUTH_COOKIE_EXPIRY=86400000

MONGODB_URI=mongodb+srv://DATABASE_USER:DATABASE_PASSWORD@CLUSTER_HOST/hoa_database?retryWrites=true&w=majority

COMPANY_GMAIL=notifications@example.com
GOOGLE_APP_PASSWORD=replace_with_google_app_password
SUPPORT_MAIL=support@example.com
```

Do not add spaces around `=`. Do not commit `.env` to source control.

### Environment variable reference

| Variable              | Required      | Purpose                                               | Example                       |
| --------------------- | ------------- | ----------------------------------------------------- | ----------------------------- |
| `NODE_ENV`            | Yes           | Controls development error details and secure cookies | `development` or `production` |
| `APP_URL`             | Yes           | Public backend URL used in email image links          | `https://api.example.com`     |
| `PORT`                | Yes           | Port on which Express listens                         | `3000`                        |
| `JWT_SECRET`          | Yes           | Secret used to sign admin login tokens                | A long random value           |
| `JWT_EXPIRY`          | Yes           | JWT validity accepted by `jsonwebtoken`               | `24h`                         |
| `AUTH_COOKIE_EXPIRY`  | Yes           | Login cookie lifetime in milliseconds                 | `86400000` for 24 hours       |
| `MONGODB_URI`         | Yes           | MongoDB connection URI, including database name       | See example above             |
| `COMPANY_GMAIL`       | For email/OTP | Gmail account used to send messages                   | `notifications@example.com`   |
| `GOOGLE_APP_PASSWORD` | For email/OTP | Google App Password, not the normal account password  | 16-digit App Password         |
| `SUPPORT_MAIL`        | For email/OTP | Reply-to/support address used by admin OTP mail       | `support@example.com`         |

Generate a strong JWT secret, for example:

```bash
openssl rand -hex 32
```

Important implementation details:

- `AUTH_COOKIE_EXPIRY` is milliseconds, while `JWT_EXPIRY` is a duration such as `24h`. Configure both to approximately the same lifetime.
- `APP_URL` must be the backend's public URL, not the frontend URL, because email templates use it to load server-hosted images.
- `src/configs/index.js` currently builds its logged `APP_URL` from `PORT`, but email templates read the `APP_URL` environment variable directly.
- `npm run dev` explicitly loads `.env`. In production, either start Node with `--env-file=.env` or configure these variables in the hosting platform.

## 5. Configure MongoDB

For MongoDB Atlas:

1. Create a project and cluster.
2. Create a database user with a strong password.
3. Permit the application server's IP address in Atlas Network Access.
4. Copy the driver connection string.
5. Add a database name, such as `hoa_database`, to the URI.
6. URL-encode special characters in the database username or password.
7. Save the complete URI as `MONGODB_URI` in `.env`.

The application creates collections automatically when data is first saved. No SQL migration is required.

Reference: [MongoDB Atlas connection guide](https://www.mongodb.com/docs/atlas/driver-connection/) and [Atlas IP access list guide](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).

## 6. Configure Allowed Frontend Origins (CORS)

Open `index.js` and update the `allowedOrigins` array:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "https://example.com",
  "https://www.example.com",
];
```

Every frontend origin must match exactly, including protocol and port. Do not add a trailing slash.

The frontend must send credentials with admin requests because authentication uses an HTTP-only cookie:

```js
fetch("https://api.example.com/admin/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

For production, use HTTPS and set `NODE_ENV=production`. If the frontend and backend are on completely different sites rather than subdomains of the same site, the current `sameSite: "strict"` cookie setting in `src/controllers/admin.controllers.js` will prevent cross-site authentication. That deployment requires an intentional cookie/CORS security change before launch.

## 7. Configure Upload Limits

Uploads are saved to:

```text
public/uploads/
```

The application exposes those files publicly as:

```text
https://BACKEND_HOST/uploads/FILENAME
```

### Maximum files per story

Open `src/configs/index.js` and change:

```js
export const appConfig = {
  max_story_uploads_length: 50,
  IS_OTP_VERIFICATION_ENABLED: false,
};
```

`max_story_uploads_length` controls the maximum total media entries allowed by story routes and the story update controller.

### Maximum files per HTTP request

Open `src/middlewares/multer.js`. The current multi-file middleware has an independent per-request limit:

```js
const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
  fileFilter: customFileFilter,
});
```

The effective upload count is the lower applicable limit. For example, leaving `files: 10` means a request cannot upload 50 files even when `max_story_uploads_length` is `50`.

To permit up to 50 files in one request, configure both locations consistently:

```js
// src/configs/index.js
max_story_uploads_length: 50,
```

```js
// src/middlewares/multer.js
files: 50,
```

Also update the hard-coded file-count response in `src/middlewares/errorHandler.js` if the Multer limit changes:

```js
message: `Cannot upload more than 50 files.`,
```

### Maximum size per file

The current limit in `src/middlewares/multer.js` is 20 MB per file:

```js
const MAX_FILE_SIZE = 20 * 1024 * 1024;
```

For example, 50 MB per file would be:

```js
const MAX_FILE_SIZE = 50 * 1024 * 1024;
```

The currently accepted MIME types are:

- Images: PNG, JPEG/JPG, WebP
- Documents: PDF, Microsoft Word `.doc`
- Videos: MP4, MPEG

To support another format, add its exact MIME type to `allowedTypes` in `src/middlewares/multer.js`. For example, `.docx` normally requires:

```js
"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
```

### Production upload storage

`public/uploads` must be writable by the Node.js process and must use persistent storage. Ephemeral hosting filesystems can erase uploaded files during a restart or redeployment. Back up this directory, or replace local disk storage with managed object storage as a separate development change.

If Nginx, Apache, a load balancer, or a hosting platform sits in front of Node.js, its request-body limit must be large enough for the maximum combined upload request.

## 8. Configure Gmail for Email and OTP

The mailer connects to Gmail SMTP at `smtp.gmail.com` on port `587` with TLS.

1. Sign in to the Google account used by `COMPANY_GMAIL`.
2. Enable two-step verification for the account.
3. Create a Google App Password for the backend.
4. Put the App Password in `GOOGLE_APP_PASSWORD`.
5. Do not use the mailbox's normal Google password.
6. Confirm the server allows outbound SMTP traffic to port `587`.

Google requires two-step verification for App Passwords. Some managed or security-restricted accounts may not offer App Passwords; in that case, contact the Google Workspace administrator or change the application's mail transport. Reference: [Google Account Help — Sign in with app passwords](https://support.google.com/accounts/answer/185833).

The admin user's MongoDB email address is the OTP recipient. Test email delivery before enabling OTP. At present, the mail helper logs a send failure but the login controller can still return “OTP sent”; therefore, check the backend log and receipt of the message during testing.

OTP behavior:

- OTP is a six-digit number.
- OTP expires after 10 minutes.
- Login and OTP verification are rate-limited to five attempts per IP every 15 minutes.
- A successful OTP verification creates the `authToken` HTTP-only cookie.

## 9. Create the First Admin User

There is no public admin registration endpoint. Create the first administrator once from the backend folder.

Start Node with the database environment loaded:

```bash
node --env-file=.env
```

At the `>` prompt, paste the following one line at a time, replacing the three example values:

```js
const mongoose = (await import("mongoose")).default;
const bcrypt = (await import("bcrypt")).default;
const AdminUser = (await import("./src/Models/admin/adminUserSchema.js"))
  .default;
await mongoose.connect(process.env.MONGODB_URI);
const passwordHash = await bcrypt.hash(
  "REPLACE_WITH_STRONG_ADMIN_PASSWORD",
  12,
);
await AdminUser.create({
  name: "Admin Name",
  email: "admin@example.com",
  password: passwordHash,
});
await mongoose.disconnect();
```

A successful create command prints the saved admin document. Exit Node:

```js
.exit
```

Security notes:

- Use a unique, strong administrator password.
- The model does not hash passwords automatically; never save a plain-text password directly in MongoDB.
- Admin emails are normalized to lowercase.
- If the email already exists, MongoDB returns a duplicate-key error. Update the existing user deliberately rather than creating duplicates.
- Remove the password from terminal scrollback/history where required by the organization's security policy.

## 10. Enable or Disable Admin OTP Verification

Open `src/configs/index.js`.

Enable OTP:

```js
export const appConfig = {
  max_story_uploads_length: 50,
  IS_OTP_VERIFICATION_ENABLED: true,
};
```

Disable OTP:

```js
IS_OTP_VERIFICATION_ENABLED: false,
```

Restart the backend after changing this file.

When OTP is enabled, the frontend login sequence is:

1. Send email and password to `POST /admin/login`.
2. The backend emails a six-digit OTP.
3. Send the same email and OTP to `POST /admin/verify-otp`.
4. Keep `credentials: "include"` enabled so the browser stores the returned authentication cookie.

Example login request:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"ADMIN_PASSWORD"}' \
  http://localhost:3000/admin/login
```

Example OTP verification request:

```bash
curl -i \
  -c admin-cookie.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","otp":"123456"}' \
  http://localhost:3000/admin/verify-otp
```

When OTP is disabled, a successful `/admin/login` response immediately sets the authentication cookie.

## 11. Start and Test Locally

Start the development server:

```bash
npm run dev
```

Expected log messages include a successful MongoDB connection and the application URL.

In another terminal, check the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

Also verify:

1. An allowed frontend origin can call a public API.
2. A disallowed origin is rejected by CORS.
3. Admin password login succeeds.
4. If enabled, the OTP arrives and `/admin/verify-otp` succeeds.
5. The browser retains the `authToken` cookie.
6. A test file appears in `public/uploads`.
7. The uploaded file remains available after an application restart or redeployment.

## 12. Production Start and Deployment

Set production values in the host's environment:

```dotenv
NODE_ENV=production
APP_URL=https://api.example.com
PORT=3000
```

Then start the application with:

```bash
node --env-file=.env index.js
```

Reference: [Node.js `--env-file` documentation](https://nodejs.org/api/cli.html#--env-filefile).

If the hosting platform injects environment variables, use:

```bash
node index.js
```

The existing `npm run build` script also runs `node index.js`; it is a long-running server start command, not a compile/build step.

Use a process manager or the hosting platform's service manager to restart the application after failures. Terminate TLS at the platform/reverse proxy, proxy traffic to `PORT`, and preserve the client IP correctly for meaningful IP rate limiting.

Production checklist:

- `NODE_ENV=production`
- HTTPS enabled
- Strong and private `JWT_SECRET`
- Production MongoDB credentials and restricted network access
- Exact production frontend origins added to `allowedOrigins`
- Gmail App Password tested if email/OTP is enabled
- Admin account created with a bcrypt hash
- Writable, persistent, backed-up upload storage
- Proxy/body-size limits compatible with application upload limits
- `.env`, database credentials, and App Password excluded from source control
- Health endpoint monitored at `GET /api/health`

## 13. Common Problems

### `No MONGODB_URI found in .env`

Confirm `.env` exists in the backend root and start with either `npm run dev` or `node --env-file=.env index.js`.

### CORS error

Add the exact frontend origin to `allowedOrigins` in `index.js`, restart the server, and confirm the frontend sends credentials for admin requests.

### Admin login always reports invalid credentials

Confirm the admin exists in MongoDB and its password field contains a bcrypt hash, not plain text.

### OTP does not arrive

Check `COMPANY_GMAIL`, `GOOGLE_APP_PASSWORD`, Google two-step verification, outbound port `587`, spam folders, and the backend's “Mail sending failed” log.

### Logo is missing in emails

The current email templates request `/hoa_logo.png`, while the bundled file is `public/hoa-logo.png`. Before production, either change the template paths to `/hoa-logo.png` or provide a file named `public/hoa_logo.png`.

### `Cannot upload more than 10 files`

The Multer `files` setting in `src/middlewares/multer.js` is still 10. Align it with `max_story_uploads_length`, then update the error message and restart.

### File size too large

Increase `MAX_FILE_SIZE` in `src/middlewares/multer.js` and also check the reverse proxy or hosting provider's body-size limit.

### Authentication works in an API tool but not in the browser

Confirm:

- frontend requests use `credentials: "include"`;
- the frontend origin is allowed by CORS;
- production uses HTTPS;
- frontend/backend domain placement is compatible with `sameSite: "strict"`;
- cookie or domain policies in the browser are not blocking the request.
