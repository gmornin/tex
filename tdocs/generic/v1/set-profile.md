POST `/api/tex/generic/v1/set-profile`

---

Set GoodMorningTex only profile.

## Request

```json
{
  "token":  String
  "profile": {
    "description": String,
    "details": [
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
- `too many profile details`
- `birth cake conflict`
- `invalid detail`
- `external`
