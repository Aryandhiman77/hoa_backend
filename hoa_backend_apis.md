# HOA Backend APIs

Frontend integration reference for the current Node.js backend.

Base URL in local development is usually:

```text
http://localhost:<PORT>
```

Public APIs are mounted under:

```text
/api/public
```

Admin APIs are mounted under:

```text
/admin
```

Static uploaded files are served from:

```text
/uploads/<filename>
```

## Common Response Shape

Successful responses generally use:

```json
{
  "success": true,
  "message": "Message text",
  "data": {},
  "meta": {}
}
```

Paginated responses use:

```json
{
  "success": true,
  "message": "Data fetched.",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalResults": 0,
    "totalPages": 0
  }
}
```

Validation errors generally use:

```json
{
  "statusCode": 400,
  "message": "Validation failed.",
  "errors": [
    {
      "message": "Field error message",
      "label": "Field label",
      "key": "field_name"
    }
  ],
  "errorCode": "VALIDATION_FAILED"
}
```

## Upload Rules

Upload routes use `multipart/form-data`.

Allowed file types:

- Images: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`
- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Videos: `video/mp4`, `video/mpeg`, `video/quicktime`, `video/x-msvideo`, `video/webm`

Limits:

- Max file size: `20 MB`
- Max files: `10`
- Multi-file field name: `uploads`
- Single featured image field name: `featured_image`

## Health

### GET `/api/health`

Health check.

No request body.

Response:

```json
{
  "status": "ok"
}
```

# Public APIs

## Submit Contact Form

### POST `/api/public/contact-form`

Content type: `application/json`

Joi validation: `contactSchema`

Request body:

| Field             | Type   | Required  | Rules                                    |
| ----------------- | ------ | --------- | ---------------------------------------- |
| `contact_name`    | string | Yes       | Lowercased, min `2`, max `100`           |
| `contact_email`   | string | No by Joi | Valid email, lowercased                  |
| `contact_phone`   | string | No        | Must match `/^\+?1?\d{10}$/` if provided |
| `contact_subject` | string | Yes       | Lowercased                               |
| `contact_message` | string | Yes       | Lowercased, min `20`                     |

Example:

```json
{
  "contact_name": "John Doe",
  "contact_email": "john@example.com",
  "contact_phone": "1234567890",
  "contact_subject": "general inquiry",
  "contact_message": "I need help understanding my HOA issue."
}
```

Notes:

- The MongoDB model requires `contact_email`, even though Joi does not currently mark it as required.
- On success, the backend saves the contact submission, sends an email, and creates an admin notification.

## Submit Story

### POST `/api/public/submit-story`

Content type: `multipart/form-data`

Joi validation: `createStoryValidation`

File field:

| Field     | Type   | Required | Rules          |
| --------- | ------ | -------- | -------------- |
| `uploads` | file[] | No       | Max `10` files |

Body fields:

| Field              | Type     | Required | Rules                                    |
| ------------------ | -------- | -------- | ---------------------------------------- |
| `story_name`       | string   | Yes      | Trimmed                                  |
| `story_email`      | string   | Yes      | Valid email, lowercased                  |
| `story_phone`      | string   | No       | Must match `/^\+?1?\d{10}$/` if provided |
| `story_city`       | string   | No       | Allows empty string or `null`            |
| `story_state`      | string   | Yes      | Trimmed                                  |
| `story_hoa_name`   | string   | No       | Allows empty string or `null`            |
| `story_issue_type` | string[] | Yes      | Min `1` item                             |
| `story_summary`    | string   | Yes      | Max `300` characters                     |
| `story_body`       | string   | Yes      | Trimmed                                  |
| `story_anonymous`  | boolean  | Yes      | `true` or `false`                        |
| `story_consent`    | boolean  | Yes      | Must be `true`                           |
| `story_disclaimer` | boolean  | Yes      | Must be `true`                           |

Important multipart note:

- `story_issue_type` is parsed through `JSON.parse`.
- When using `multipart/form-data`, send it as a JSON string, for example:

```text
story_issue_type=["fees","board misconduct"]
```

Example fields:

```json
{
  "story_name": "John Doe",
  "story_email": "john@example.com",
  "story_phone": "1234567890",
  "story_city": "Austin",
  "story_state": "TX",
  "story_hoa_name": "Sample HOA",
  "story_issue_type": ["fees", "board misconduct"],
  "story_summary": "Short story summary under 300 characters.",
  "story_body": "Full story details here.",
  "story_anonymous": false,
  "story_consent": true,
  "story_disclaimer": true
}
```

On success, the backend saves the story with status `new`, sends an email, and creates an admin notification.

## View Public Stories

### GET `/api/public/hoa-horror-stories`

Returns published stories only.

Query params:

| Param       | Type            | Required | Meaning                                                               |
| ----------- | --------------- | -------- | --------------------------------------------------------------------- |
| `page`      | number          | No       | 1-based page number. Default `1`                                      |
| `limit`     | number          | No       | Results per page. Default `10`                                        |
| `sortOrder` | string          | No       | `asc` or anything else for descending                                 |
| `state`     | string          | No       | Filters by `story_state`                                              |
| `category`  | string/string[] | No       | Filters `story_issue_type`                                            |
| `tag`       | string/string[] | No       | Filters `story_issue_type`; fallback alternative to `category`        |
| `keyword`   | string          | No       | Searches story name, summary, body, HOA name, city, state, issue type |

Response data fields selected by backend:

```text
story_name
story_city
story_state
story_hoa_name
story_issue_type
story_summary
story_anonymous
status
```

Example:

```text
GET /api/public/hoa-horror-stories?page=1&limit=10&state=TX&keyword=fees
```

## Submit Non-Legal Advocate Request

### POST `/api/public/non-legal-advocate/create`

Content type: `multipart/form-data`

Joi validation: `createNonLegalAdvocateValidation`

File field:

| Field     | Type   | Required | Rules          |
| --------- | ------ | -------- | -------------- |
| `uploads` | file[] | No       | Max `10` files |

Body fields:

| Field                   | Type    | Required | Rules                         |
| ----------------------- | ------- | -------- | ----------------------------- |
| `adv_name`              | string  | Yes      | Trimmed                       |
| `adv_email`             | string  | Yes      | Valid email, lowercased       |
| `adv_phone`             | string  | Yes      | Must match `/^\+?1?\d{10}$/`  |
| `adv_state`             | string  | Yes      | Trimmed                       |
| `adv_hoa_name`          | string  | No       | Allows empty string or `null` |
| `adv_issue_summary`     | string  | Yes      | Trimmed                       |
| `adv_estimated_damages` | string  | No       | Allows empty string or `null` |
| `adv_key_dates`         | string  | No       | Allows empty string or `null` |
| `adv_disclaimer`        | boolean | Yes      | Must be `true`                |

Example:

```json
{
  "adv_name": "John Doe",
  "adv_email": "john@example.com",
  "adv_phone": "1234567890",
  "adv_state": "TX",
  "adv_hoa_name": "Sample HOA",
  "adv_issue_summary": "I need non-legal advocacy support.",
  "adv_estimated_damages": "$5000",
  "adv_key_dates": "2026-05-30",
  "adv_disclaimer": true
}
```

## Submit Attorney

### POST `/api/public/attorney-submission`

Content type: `application/json`

Joi validation: `createAttorneySubmissionValidation`

Request body:

| Field                     | Type               | Required | Rules                                    |
| ------------------------- | ------------------ | -------- | ---------------------------------------- |
| `attorney_name`           | string             | Yes      | Trimmed                                  |
| `attorney_firm`           | string             | Yes      | Trimmed                                  |
| `attorney_email`          | string             | Yes      | Valid email, lowercased                  |
| `attorney_phone`          | string             | Yes      | Must match `/^\+?1?\d{10}$/`             |
| `attorney_website`        | string             | No       | Valid URI; allows empty string or `null` |
| `attorney_city`           | string             | Yes      | Trimmed                                  |
| `attorney_state`          | string             | Yes      | Trimmed                                  |
| `attorney_county`         | string             | No       | Allows empty string or `null`            |
| `attorney_practice_areas` | string[] or string | Yes      | Array must have min `1` item             |
| `attorney_summary`        | string             | Yes      | Trimmed                                  |
| `attorney_bio`            | string             | No       | Allows empty string or `null`            |
| `attorney_disclaimer_ack` | boolean            | Yes      | Must be `true`                           |

Example:

```json
{
  "attorney_name": "Jane Lawyer",
  "attorney_firm": "Jane Law LLC",
  "attorney_email": "jane@example.com",
  "attorney_phone": "1234567890",
  "attorney_website": "https://example.com",
  "attorney_city": "Austin",
  "attorney_state": "TX",
  "attorney_county": "Travis",
  "attorney_practice_areas": ["HOA disputes", "Real estate"],
  "attorney_summary": "HOA dispute attorney serving homeowners.",
  "attorney_bio": "Longer attorney bio.",
  "attorney_disclaimer_ack": true
}
```

## View Public Attorneys

### GET `/api/public/attorneys`

Returns approved and published attorneys only.

Query params:

| Param           | Type            | Required | Meaning                                                                |
| --------------- | --------------- | -------- | ---------------------------------------------------------------------- |
| `page`          | number          | No       | 1-based page number. Default `1`                                       |
| `limit`         | number          | No       | Results per page. Default `10`                                         |
| `sortOrder`     | string          | No       | `asc` or anything else for descending                                  |
| `state`         | string          | No       | Filters by `attorney_state`                                            |
| `city`          | string          | No       | Filters by `attorney_city`                                             |
| `country`       | string          | No       | Code currently maps this to `attorney_county`                          |
| `practice_area` | string/string[] | No       | Intended to filter `attorney_practice_areas`                           |
| `keyword`       | string          | No       | Searches name, firm, summary, bio, city, state, county, practice areas |

Response excludes:

```text
_id
createdAt
updatedAt
approvedAt
isPublished
status
attorney_disclaimer_ack
```

Current caveat:

- The `practice_area` filter currently references `practiceArea` internally, so using this query param may fail until fixed.

# Admin APIs

Current admin routes do not apply authentication middleware in `admin.routes.js`.

## Create Page

### POST `/admin/page/create`

Content type: `multipart/form-data`

Joi validation: `createPageValidation`

File field:

| Field            | Type | Required | Rules         |
| ---------------- | ---- | -------- | ------------- |
| `featured_image` | file | Yes      | Single upload |

Body fields:

| Field              | Type   | Required | Rules                  |
| ------------------ | ------ | -------- | ---------------------- |
| `title`            | string | Yes      | Trimmed                |
| `hero_title`       | string | Yes      | Trimmed                |
| `hero_body`        | string | Yes      | Trimmed                |
| `sections`         | array  | No       | Defaults to `[]`       |
| `seo_title`        | string | Yes      | Trimmed                |
| `meta_description` | string | Yes      | Trimmed                |
| `publish_status`   | string | No       | `draft` or `published` |

`sections[]` item fields:

| Field        | Type   | Required | Rules                         |
| ------------ | ------ | -------- | ----------------------------- |
| `type`       | string | Yes      | Trimmed                       |
| `title`      | string | No       | Allows empty string or `null` |
| `body`       | string | No       | Allows empty string or `null` |
| `buttonText` | string | No       | Allows empty string or `null` |
| `buttonUrl`  | string | No       | Allows empty string or `null` |
| `items`      | array  | No       | Defaults to `[]`              |

Example:

```json
{
  "title": "About Us",
  "hero_title": "About HOA",
  "hero_body": "Page hero body.",
  "sections": [
    {
      "type": "text",
      "title": "Section title",
      "body": "Section body",
      "buttonText": "",
      "buttonUrl": "",
      "items": []
    }
  ],
  "seo_title": "About HOA",
  "meta_description": "About page meta description.",
  "publish_status": "draft"
}
```

Current caveat:

- The Mongoose page model requires `slug`, but the create page Joi schema does not include `slug`.

## View Admin Stories

### GET `/admin/stories`

Lists stories for admin.

Query params:

| Param    | Type   | Required | Meaning                                                                             |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| `page`   | number | No       | 1-based page number. Default `1`                                                    |
| `limit`  | number | No       | Results per page. Default `10`                                                      |
| `search` | string | No       | Searches story name, email, phone, summary, body, HOA name, city, state, issue type |

Response data fields selected by backend:

```text
story_name
story_city
story_state
story_hoa_name
story_issue_type
story_summary
story_anonymous
isPublished
status
```

Example:

```text
GET /admin/stories?page=1&limit=20&search=fees
```

## View Admin Story Details

### GET `/admin/story/details/:id`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

No Joi validation.

Behavior:

- Fetches full story by ID.
- Sets `status` to `under_review`.
- Sets `reviewedAt` to the current time.
- Saves and returns the story.

## Update Story Details

### PUT `/admin/story/update/:id`

Content type: `application/json`

Joi validation: `updateStoryValidation`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body:

| Field              | Type     | Required | Rules                                                         |
| ------------------ | -------- | -------- | ------------------------------------------------------------- |
| `story_name`       | string   | Yes      | Trimmed                                                       |
| `story_city`       | string   | No       | Allows empty string or `null`                                 |
| `story_state`      | string   | Yes      | Trimmed                                                       |
| `story_hoa_name`   | string   | No       | Allows empty string or `null`                                 |
| `story_issue_type` | string[] | Yes      | Min `1` item                                                  |
| `story_summary`    | string   | Yes      | Max `300` characters                                          |
| `story_body`       | string   | Yes      | Trimmed                                                       |
| `story_anonymous`  | boolean  | Yes      | `true` or `false`                                             |
| `status`           | string   | No       | `flagged`, `approved`, `published`, `unpublished`, `archived` |
| `adminNotes`       | string   | No       | Allows empty string or `null`                                 |

Example:

```json
{
  "story_name": "John Doe",
  "story_city": "Austin",
  "story_state": "TX",
  "story_hoa_name": "Sample HOA",
  "story_issue_type": ["fees"],
  "story_summary": "Updated summary.",
  "story_body": "Updated full story.",
  "story_anonymous": false,
  "status": "approved",
  "adminNotes": "Reviewed by admin."
}
```

Status behavior:

- `approved`: sets `status = approved`, `isApproved = true`
- `published`: requires `isApproved = true`, sets `status = published`, `isPublished = true`
- `flagged`: sets `status = flagged`
- `unpublished`: sets `status = unpublished`
- `archived`: sets `status = archived`

## Add Story Uploads

### PATCH `/admin/story/add-uploads/:id`

Content type: `multipart/form-data`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

File field:

| Field     | Type   | Required | Rules                                     |
| --------- | ------ | -------- | ----------------------------------------- |
| `uploads` | file[] | Yes      | Max `10` total story uploads after adding |

Behavior:

- Adds uploaded files to `story_uploads`.
- Rejects if total story media count becomes greater than `10`.

## Remove Story Uploads

### DELETE `/admin/story/remove-uploads/:id`

Content type: `application/json`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body:

| Field      | Type     | Required | Rules                                       |
| ---------- | -------- | -------- | ------------------------------------------- |
| `fileUrls` | string[] | Yes      | Must contain one or more uploaded file URLs |

Example:

```json
{
  "fileUrls": ["/uploads/story-example.jpg"]
}
```

Behavior:

- Removes matching file URLs from the story document.
- Deletes files from `public/uploads`.

## View Admin Attorneys

### GET `/admin/attorney/listing`

Lists attorney submissions for admin.

Query params:

| Param    | Type   | Required | Meaning                                                                       |
| -------- | ------ | -------- | ----------------------------------------------------------------------------- |
| `page`   | number | No       | 1-based page number. Default `1`                                              |
| `limit`  | number | No       | Results per page. Default `10`                                                |
| `status` | string | No       | Filters by attorney `status`                                                  |
| `search` | string | No       | Searches name, email, firm, summary, bio, city, state, county, practice areas |

Response excludes:

```text
approvedAt
isPublished
attorney_disclaimer_ack
```

Example:

```text
GET /admin/attorney/listing?page=1&limit=10&status=new&search=jane
```

## View Admin Attorney Details

### GET `/admin/attorney/:id`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

No Joi validation.

Behavior:

- Fetches attorney by ID.
- Sets `status` to `under_review`.
- Sets `reviewedAt` to current time.
- Saves and returns the attorney.

## Update Attorney Details

### PUT `/admin/attorney/update-details/:id`

Content type: `application/json`

Joi validation: `updateAttorneySubmissionValidation`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body:

| Field                     | Type               | Required | Rules                                    |
| ------------------------- | ------------------ | -------- | ---------------------------------------- |
| `attorney_name`           | string             | Yes      | Trimmed                                  |
| `attorney_firm`           | string             | Yes      | Trimmed                                  |
| `attorney_email`          | string             | Yes      | Valid email, lowercased                  |
| `attorney_phone`          | string             | Yes      | Must match `/^\+?1?\d{10}$/`             |
| `attorney_website`        | string             | No       | Valid URI; allows empty string or `null` |
| `attorney_city`           | string             | Yes      | Trimmed                                  |
| `attorney_state`          | string             | Yes      | Trimmed                                  |
| `attorney_county`         | string             | No       | Allows empty string or `null`            |
| `attorney_practice_areas` | string[] or string | Yes      | Array must have min `1` item             |
| `attorney_summary`        | string             | Yes      | Trimmed                                  |
| `attorney_bio`            | string             | No       | Allows empty string or `null`            |

Example:

```json
{
  "attorney_name": "Jane Lawyer",
  "attorney_firm": "Jane Law LLC",
  "attorney_email": "jane@example.com",
  "attorney_phone": "1234567890",
  "attorney_website": "https://example.com",
  "attorney_city": "Austin",
  "attorney_state": "TX",
  "attorney_county": "Travis",
  "attorney_practice_areas": ["HOA disputes"],
  "attorney_summary": "Updated attorney summary.",
  "attorney_bio": "Updated bio."
}
```

## Approve Attorney

### PATCH `/admin/attorney/update-status/approve/:id`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Behavior:

- Sets `status = approved`
- Sets `isApproved = true`

## Decline Attorney

### PATCH `/admin/attorney/update-status/decline/:id`

Content type: `application/json`

Joi validation: `declineAttorneySchema`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body:

| Field           | Type   | Required | Rules                          |
| --------------- | ------ | -------- | ------------------------------ |
| `declineReason` | string | Yes      | Lowercased, min `10` by schema |

Example:

```json
{
  "declineReason": "profile information is incomplete"
}
```

Behavior:

- Sets `status = declined`
- Sets `declineReason`
- Sets `isApproved = false`
- Sets `isPublished = false`

Current caveat:

- Validation message says minimum `20` characters, but the schema currently uses `.min(10)`.

## Publish Attorney

### PATCH `/admin/attorney/update-status/publish/:id`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Behavior:

- Requires attorney to already be approved.
- Sets `isPublished = true`
- Sets `status = published`

## Unpublish Attorney

### PATCH `/admin/attorney/update-status/unpublish/:id`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Behavior:

- Requires attorney to already be approved.
- Requires attorney to already be published.
- Sets `isPublished = false`
- Sets `status = unpublished`

## Archive Attorney

### PATCH `/admin/attorney/update-status/archieve/:id`

No Joi validation.

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Behavior:

- Sets `status = archived`

Note:

- The route and status currently use the spelling `archieve` / `archived`.

## Create Blog

### POST `/admin/blog/create`

Current status: not ready for frontend integration.

Notes:

- Route exists.
- Controller body is currently empty.
- Route calls `validate("")`, which is not a valid Joi schema and may fail at runtime.

## Create FAQ

### POST `/admin/faq/create`

Content type: `application/json`

Joi validation: `faqValidationSchema`

Request body:

| Field            | Type   | Required | Rules                  |
| ---------------- | ------ | -------- | ---------------------- |
| `question`       | string | Yes      | Trimmed                |
| `answer`         | string | Yes      | Trimmed                |
| `category`       | string | Yes      | Trimmed                |
| `sortOrder`      | number | No       | Integer, min `0`       |
| `publish_status` | string | Yes      | `draft` or `published` |

Example:

```json
{
  "question": "What is an HOA?",
  "answer": "An HOA is a homeowners association.",
  "category": "general",
  "sortOrder": 1,
  "publish_status": "draft"
}
```

## View Single FAQ

### GET `/admin/faq/:id`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

No Joi validation.

Returns one FAQ by ID.

## View FAQ Listing

### GET `/admin/faq/listing`

Lists FAQs.

Query params:

| Param    | Type   | Required | Meaning                                             |
| -------- | ------ | -------- | --------------------------------------------------- |
| `page`   | number | No       | 1-based page number. Default `1`                    |
| `limit`  | number | No       | Results per page. Default `10`                      |
| `search` | string | No       | Searches question, answer, category, publish status |
| `status` | string | No       | Intended to filter publish status                   |

Sorting:

- Defaults to `{ sortOrder: 1 }`.

Current caveat:

- The status filter currently references an undefined variable `publish_status`, so `status` filtering may fail until fixed.

## Update FAQ Details

### PUT `/admin/faq/update-details/:id`

Content type: `application/json`

Joi validation: `faqValidationSchema`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body:

| Field            | Type   | Required | Rules                  |
| ---------------- | ------ | -------- | ---------------------- |
| `question`       | string | Yes      | Trimmed                |
| `answer`         | string | Yes      | Trimmed                |
| `category`       | string | Yes      | Trimmed                |
| `sortOrder`      | number | No       | Integer, min `0`       |
| `publish_status` | string | Yes      | `draft` or `published` |

Example:

```json
{
  "question": "Updated question?",
  "answer": "Updated answer.",
  "category": "general",
  "sortOrder": 2,
  "publish_status": "published"
}
```

## Update FAQ Status

### PATCH `/admin/faq/update-status/:id`

Content type: `application/json`

Joi validation: `faqStatusValidation`

Path params:

| Param | Type             | Required |
| ----- | ---------------- | -------- |
| `id`  | MongoDB ObjectId | Yes      |

Request body as per Joi:

| Field            | Type   | Required | Rules                  |
| ---------------- | ------ | -------- | ---------------------- |
| `publish_status` | string | Yes      | `draft` or `published` |

Example:

```json
{
  "publish_status": "published"
}
```

Current caveat:

- The controller currently reads `req.data.status`, not `req.data.publish_status`, so this endpoint may set status to `draft` unless the controller is fixed.

# Integration Caveats From Current Code

These are not frontend requirements, but they may affect integration testing:

- `.env` is loaded in `index.js` after config imports, so environment values may not be available early enough depending on runtime.
- `node` and `npm` were not available in the current shell, so this document was generated from source inspection rather than by running the server.
- `package.json` already had local modifications before this document was created.
- Some admin/CMS files are incomplete or inconsistent, especially blog creation, admin auth model, page slug generation, and FAQ status handling.
