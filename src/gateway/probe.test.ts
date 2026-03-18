import { describe, expect, it, vi } from "vitest";

const gatewayClientState = vi.hoisted(() => ({
  options: null as Record<string, unknown> | null,
}));

class MockGatewayClient {
  private readonly opts: Record<string, unknown>;

  constructor(opts: Record<string, unknown>) {
    this.opts = opts;
    gatewayClientState.options = opts;
  }

  start(): void {
    void Promise.resolve()
      .then(async () => {
        const onHelloOk = this.opts.onHelloOk;
        if (typeof onHelloOk === "function") {
          await onHelloOk();
        }
      })
      .catch(() => {});
  }

  stop(): void {}

  async request(method: string): Promise<unknown> {
    if (method === "system-presence") {
      return [];
    }
    return {};
  }
}

vi.mock("./client.js", () => ({
  GatewayClient: MockGatewayClient,
}));

const { probeGateway } = await import("./probe.js");

describe("probeGateway", () => {
  it("connects with operator.read scope", async () => {
    const result = await probeGateway({
      url: "ws://127.0.0.1:18789",
      auth: { token: "secret" },
      timeoutMs: 1_000,
    });

    expect(gatewayClientState.options?.scopes).toEqual(["operator.read"]);
    expect(result.ok).toBe(true);
  });

  it("skips device identity for anonymous loopback when auth is effectively empty", async () => {
    await probeGateway({
      url: "ws://127.0.0.1:18789",
      auth: { token: undefined, password: undefined },
      timeoutMs: 1_000,
    });
    expect(gatewayClientState.options?.skipDeviceIdentity).toBe(true);
  });

  it("skips device identity for anonymous loopback when auth is undefined", async () => {
    await probeGateway({
      url: "ws://localhost:18789",
      timeoutMs: 1_000,
    });
    expect(gatewayClientState.options?.skipDeviceIdentity).toBe(true);
  });

  it("does not skip device identity when auth has token on loopback", async () => {
    await probeGateway({
      url: "ws://127.0.0.1:18789",
      auth: { token: "secret" },
      timeoutMs: 1_000,
    });
    expect(gatewayClientState.options?.skipDeviceIdentity).toBeFalsy();
  });
});
