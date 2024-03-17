GET `/api/publish/v1/publishes/id/[userid]?page=Number&page_size=Number` or `/api/publish/v1/publishes/name/[username]?page=Number&page_size=Number`

---

List a user's publishes.

## Response

Status code: `200`

```json
{
    "type": "tex user publishes",
    "items": [
        {
            "id": Number,
            "published": Number,
            "title": String,
            "desc": String,
            "ext": String
        },
        // ...
    ],
    "total": Number,
    "continuation": Boolean
}
```

## Possible errors

- `no such user`
- `not created`
- `external`
