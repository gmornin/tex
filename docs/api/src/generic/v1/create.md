POST `/api/generic/v1/create`

---

Enable GM Tex for the GM account.

## Request

```json
{
    "token": String,
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
- `feature disabled`
- `external`
