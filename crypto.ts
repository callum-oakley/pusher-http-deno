import {
  createHash,
  SupportedAlgorithm,
} from "https://deno.land/std@0.74.0/hash/mod.ts"
import { concat } from "https://deno.land/std@0.74.0/bytes/mod.ts"

export function hash(
  algorithm: SupportedAlgorithm,
  message: Uint8Array
): Uint8Array {
  const h = createHash(algorithm)
  h.update(message)
  return new Uint8Array(h.digest())
}

// https://en.wikipedia.org/wiki/HMAC#Implementation
export function hmac(
  algorithm: "sha256", // Only support SHA256 for now
  key: Uint8Array,
  message: Uint8Array
): Uint8Array {
  if (key.length > 64) {
    key = hash(algorithm, key)
  }

  if (key.length < 64) {
    key = concat(key, new Uint8Array(64 - key.length))
  }

  const oKeyPad = key.map((b) => b ^ 0x5c)
  const iKeyPad = key.map((b) => b ^ 0x36)

  return hash(
    algorithm,
    concat(oKeyPad, hash(algorithm, concat(iKeyPad, message)))
  )
}

export function encodeHex(buf: Uint8Array): string {
  return buf.reduce((acc, b) => acc + b.toString(16).padStart(2, "0"), "")
}

export function decodeUTF8(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}
