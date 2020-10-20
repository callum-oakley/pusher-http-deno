import { decodeUTF8, encodeHex, hash, hmac } from "./crypto.ts"

export function signedQuery(
  key: string,
  secret: string,
  method: string,
  path: string,
  body: string | undefined,
  timestamp = Math.round(Date.now() / 1000)
) {
  const params = {
    auth_key: key,
    auth_timestamp: timestamp,
    auth_version: "1.0",
    body_md5: body ? encodeHex(hash("md5", decodeUTF8(body))) : undefined,
  }
  const unsignedQuery = Object.entries(params)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  return `${unsignedQuery}&auth_signature=${encodeHex(
    hmac(
      "sha256",
      decodeUTF8(secret),
      decodeUTF8([method, path, unsignedQuery].join("\n"))
    )
  )}`
}
