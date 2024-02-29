POST `/api/compile/v1/simple`

---

Compile a file from one format to another.

## Request

```json
{
    "token": String,
    "path": String, // path to source file,
    "from": String, // markdown, latex
    "to": String // html, pdf
}
```

## Response

Status code: `201`

```json
{
    "type": "compiled",
    "id": Number,
    "newpath": String
}
```

## Possible errors

- `invalid token`
- `not verified`
- `compile error`
- `not created`
- `permission denied`
- `external`
