import { version } from "./version.ts"
import { decodeUTF8, encodeHex, hash } from "./crypto.ts"
import { signedQuery } from "./auth.ts"

export type Config = {
  appId: string
  key: string
  secret: string
  cluster: string
}

export class Client {
  readonly config: Config

  constructor(config: Config) {
    this.config = config
  }

  trigger(
    channels: string | string[],
    name: string,
    data: Record<string, unknown>
  ): Promise<Response> {
    return this.signedFetch(
      "POST",
      `/apps/${this.config.appId}/events`,
      JSON.stringify({
        name,
        // Double encode data only if it's not already a string. A historical
        // quirk of the API.
        data: typeof data === "string" ? data : JSON.stringify(data),
        channels: typeof channels === "string" ? [channels] : channels,
      })
    )
  }

  private signedFetch(
    method: string,
    path: string,
    body: string | undefined
  ): Promise<Response> {
    const q = signedQuery(
      this.config.key,
      this.config.secret,
      method,
      path,
      body
    )
    return fetch(`${this.host()}${path}?${q}`, {
      method,
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => {
      if (!res.ok) {
        return res.text().then((body) => {
          throw new Error(
            `Unexpected status ${res.status} (${res.statusText}): ${body}`
          )
        })
      }
      return res
    })
  }

  private host(): string {
    return `https://api-${this.config.cluster}.pusher.com`
  }
}
