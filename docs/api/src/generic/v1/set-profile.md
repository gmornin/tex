POST `/api/generic/v1/set-profile`

---

Resets GM Tex profile.

## Request

```json
{
    "description": String,
    "details": [
        ProfileDetail...
    ]
}
```

Check [profile.rs](https://github.com/gmornin/rust-bindings/blob/master/src/structs/profile.rs) for all variants of `ProfileDetail`.

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
