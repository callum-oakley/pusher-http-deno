import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts"

import { decodeUTF8, encodeHex, hmac } from "./crypto.ts"

Deno.test("hmac sha256", () => {
  assertEquals(
    encodeHex(
      hmac(
        "sha256",
        decodeUTF8("key"),
        decodeUTF8("The quick brown fox jumps over the lazy dog")
      )
    ),
    "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8"
  )
})
