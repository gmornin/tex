POST `/api/generic/v1/reset-pfp`

---

Resets GM Tex profile picture.

## Request

```json
{
    "token": String,
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
- `not verified`
- `not created`
- `external`
