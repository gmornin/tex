POST `/api/tex/generic/v1/reset-pfp`

---

Resets profile to default.

> Note: this does not reset account wide status, for that you will need to use `/api/accounts/v1/set-status` to a blank string as well.

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
  "type": "profile updated"
}
```

## Possible errors

- `invalid token`
- `not created`
- `not verified`
- `exceeds maximum length`
- `external`
