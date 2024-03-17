GET `/api/publish/v1/published-info/id/[userid]/[publish id]`

---

Get information of a published item.

## Response

Status code: `200`

```json
{
    "type": "tex publish publish",
    "id": Number,
    "published": Number,
    "title": String,
    "desc": String,
    "ext": String
}
```

## Possible errors

- `not verified`
- `not created`
- `entry not found`
- `external`
