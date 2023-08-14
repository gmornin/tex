POST `/api/tex/generic/v1/reset-pfp`

---

Resets pfp to default.

## Request

```json
{
  "token": String
}
```

## Response

Status code: `200`

```json
{
  "type": "pfp reset"
}
```

## Possible errors

- `invalid token`
- `not created`
- `not verified`
- `external`
