POST `/api/publish/v1/publish`

---

Publish a file to be listed.

## Request

```json
{
    "token": String,
    "path": String,
    "title": String,
    "desc": String,
}
```

## Response

Status code: `201`

```json
{
    "type": "tex published",
    "id": Number
}
```

## Possible errors

- `invalid token`
- `not verified`
- `file not found`
- `type mismatch`
- `storage full`
- `external`
