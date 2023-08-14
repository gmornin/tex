GET `/api/tex/publish/v1/publishes/id/[user id]?page=[u32]&page_size=[u32]`

---

Get user published articles.

## Response

Status code: `200`

```json
{
  "type": "tex user publishes",
  "items": [
    {
      "id": i64,
      "title": String,
      "desc": String,
      "ext": String
    },
    // ...
  ]
}
```

## Possible errors

- `no such user`
- `external`
