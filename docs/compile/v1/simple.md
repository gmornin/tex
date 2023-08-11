POST `/api/tex/compile/v1/simple`

---

Compiles a source file to a web friendly format. Server will returns result when compilation is done.

## Request

```json
{
  "token": String,
  "path": String, (omit the beginning `/tex` as it can only be used in the `/tex` directory)
  "from": FromFormat,
  "to": ToFormat,
  "compiler": Compiler // leave blank for default
}
```

> Reference [this page](../) for available formats.

## Response

Status code: `201`

```json
{
  "type": "compiled",
  "id": u64, // job id
  "newpath": String
}
```

## Possible errors

- `invalid token`
- `not created`
- `not verified`
- `permission denied`
- `external`
- `compile error`
