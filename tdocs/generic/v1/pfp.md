GET `/api/tex/generic/v1/pfp/id/{userid}`

---

Get profile pic for user with id.

## Response

Status code: `200`

The image (png, or svg for default pfp if it is not set).

## Possible errors

- `no such user`
- `not created`
- `external`
