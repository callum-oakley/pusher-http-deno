import { Client } from "./client.ts"

const appId = Deno.env.get("APP_ID")
if (!appId) {
  throw new Error("Please provide APP_ID")
}

const key = Deno.env.get("KEY")
if (!key) {
  throw new Error("Please provide KEY")
}

const secret = Deno.env.get("SECRET")
if (!secret) {
  throw new Error("Please provide SECRET")
}

const cluster = Deno.env.get("CLUSTER")
if (!cluster) {
  throw new Error("Please provide CLUSTER")
}

new Client({ appId, key, secret, cluster })
  .trigger("foo", "bar", { message: "hello world" })
  .then(() => console.log("done"))
  .catch((err) => console.error(err))
