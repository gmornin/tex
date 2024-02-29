POST `/api/generic/v1/set-pfp/[token]`

---

Set GM Tex profile picture.

## Request

```json
[multipart file post]
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
- `file too large`
- `not verified`
- `file type mismatch`
- `not created`
- `external`
