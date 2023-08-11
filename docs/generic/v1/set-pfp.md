POST with multipart `/api/tex/generic/v1/set-pfp/{id}`

---

Upload GoodMorningTex only pfp (only png allowed).

## Request

```json
[Multipart file post]
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
- `file type mismatch`
- `file too large`
- `external`
