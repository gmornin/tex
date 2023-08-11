GET `/api/tex/generic/v1/profile/id/{userid}`

---

Get user profile.

## Response

Status code: `200`

```json
{
  "type": "profile",
  "account": {
    "id": i64,
    "username": String,
    "verified": bool,
    "created": u64,
    "status": String
  },
  "profile": {
    "description": String,
    "detail": [
      {
        "type": "cake day",
        "value": {
          "day": u8,
          "month": u8
        }
      },
      {
        "type": "contact",
        "value": {
          "type": "matrix",
          "name": String,
          "instance": String
        }
      },
      // ...
    ]
  }
}
```

> For more reference [profile.rs](https://github.com/GoodMorning-Network/rust-bindings/blob/master/src/structs/profile.rs)

## Possible errors

- `no such user`
- `not created`
- `external`
