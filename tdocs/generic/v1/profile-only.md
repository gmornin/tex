GET `/api/tex/generic/v1/profile-only/id/{userid}`

---

Get user profile only, without account info (faster).

## Response

Status code: `200`

```json
{
  "type": "profile only",
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

- `not created`
- `external`
