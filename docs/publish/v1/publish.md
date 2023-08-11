POST `/api/tex/publish/v1/publish`

---

Publishes a file.

## Request

```json
{
  "token":  String,
  "path": String, // omit `/tex`
  "title": String,
  "desc": String
}
```

## Response

Status code: `201`

```json
{
  "type": "tex published",
  "id": i64
}
```

## Possible errors

- `invalid token`
- `not verified`
- `file not found`
- `external`
