GET `/api/publish/v1/update_publish`

---

List a user's publishes.

## Request

```json
{
    "token": String,
    "id": Number,
    "path": String
}
```

## Response

Status code: `200`

```json
{
    "type": "tex publish updated"
}
```

## Possible errors

- `invalid token`
- `not verified`
- `not created`
- `file not found`
- `entry not found`
- `type mismatch`
- `storage full`
- `external`
