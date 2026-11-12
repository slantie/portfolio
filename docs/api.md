# Portfolio API

Generic contract for a portfolio service. All examples use fictional data.

## Base URL

```text
/api/v1
```

## Response envelope

Successful responses return the resource directly. Collection endpoints return:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 20, "total": 0 }
}
```

Errors use:

```json
{
  "error": { "code": "NOT_FOUND", "message": "Resource not found" }
}
```

## Endpoints

### `GET /profile`

Returns the public profile, contact links, and summary statistics.

### `GET /projects`

Returns projects ordered by `startYear` descending.

Query parameters:

- `page` — positive integer, default `1`
- `pageSize` — `1–100`, default `20`
- `featured` — optional boolean
- `category` — optional category slug

### `GET /projects/:id`

Returns one project. Responds with `404 NOT_FOUND` when the id does not exist.

### `GET /experience`

Returns professional experience and leadership entries ordered by `sortOrder`.

### `GET /skills`

Returns skills grouped by category.

### `GET /education`

Returns education entries ordered by `sortOrder`.

### `GET /achievements`

Returns awards, certifications, publications, and recognitions.

Query parameter:

- `type` — optional `award`, `certificate`, `publication`, `recognition`, or `felicitation`

### `POST /contact`

Creates a contact message.

Request body:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project enquiry",
  "message": "Hello. I would like to discuss a collaboration."
}
```

Returns `201` with `{ "data": { "id": "message-id", "status": "received" } }`.

## Common resource shapes

```ts
type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  event?: string;
  startMonth: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  ongoing: boolean;
  image?: string;
  images?: string[];
  tags: string[];
  links: { website?: string; repository?: string; reference?: string };
  featured: boolean;
  category: string[];
  skills: string[];
  achievements?: string[];
  teamSize?: number;
  role?: string;
};

type Experience = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  kind: "professional" | "leadership";
  sortOrder: number;
};
```

## Status codes

`200` success · `201` created · `400` invalid request · `404` not found · `409` conflict · `500` server error.

## Implementation notes

- Validate and normalize URLs before persistence.
- Sanitize contact-message output before rendering it in an admin view.
- Add authentication to all write/admin endpoints.
- Keep pagination stable by sorting on a deterministic secondary key such as `id`.
