POST `/api/tex/generic/v1/create`

---

Set up your account for GoodMorningTex.

## Request

```json
{
  "token": String
}
```

## Response

Status code: `201`

```json
{
  "type": "compiled",
  "id": u64, // job id
  "newpath": String,
  "message": String
}
```

## Possible errors

- `invalid token`
- `already created`
- `not verified`
- `external`
