import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts"

import { signedQuery } from "./auth.ts"

Deno.test("signedQuery", () => {
  // Example from https://pusher.com/docs/channels/library_auth_reference/rest-api#worked-authentication-example
  assertEquals(
    signedQuery(
      "278d425bdf160c739803",
      "7ad3773142a6692b25b8",
      "POST",
      "/apps/3/events",
      '{"name":"foo","channels":["project-3"],"data":"{\\"some\\":\\"data\\"}"}',
      1353088179
    ),
    "auth_key=278d425bdf160c739803&auth_timestamp=1353088179&auth_version=1.0&body_md5=ec365a775a4cd0599faeb73354201b6f&auth_signature=da454824c97ba181a32ccc17a72625ba02771f50b50e1e7430e47a1f3f457e6c"
  )
})
