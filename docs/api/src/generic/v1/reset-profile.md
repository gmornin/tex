POST `/api/generic/v1/reset-profile`

---

Resets GM Tex profile.

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
    "type": "profile updated"
}
```

## Possible errors

- `invalid token`
- `not verified`
- `not created`
- `external`
