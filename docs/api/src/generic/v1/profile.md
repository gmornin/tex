GET `/api/generic/v1/profile/id/[id]` (recommended) or `/api/generic/v1/profile/name/[username]`

---

Get GM Tex profile of a user.

## Response

Status code: `200`

```json
{
    "type": "profile-only", // this wasn't intentional, but now the names are stuck
    "description": String,
    "details": [
        ProfileDetail...
    ]
}
```

Check [profile.rs](https://github.com/gmornin/rust-bindings/blob/master/src/structs/profile.rs) for all variants of `ProfileDetail`.

## Possible errors

- `not created`
- `no such user`
- `external`
