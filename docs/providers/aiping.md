---
summary: "Use AIPing OpenAI-compatible models in OpenClaw"
read_when:
  - You want to use AIPing as your LLM provider
  - You need OpenAI-compatible base URL + API key setup
title: "AIPing"
---

# AIPing

AIPing provides an OpenAI-compatible API endpoint at `https://aiping.cn/api/v1`.
You can configure it in OpenClaw like other API-key providers (for example
OpenAI or Moonshot).

## CLI setup

```bash
openclaw onboard --auth-choice aiping-api-key

# non-interactive
openclaw onboard --auth-choice aiping-api-key --aiping-api-key "$AIPING_API_KEY"
```

## Config snippet

```json5
{
  env: { AIPING_API_KEY: "your-aiping-key" },
  agents: { defaults: { model: { primary: "aiping/DeepSeek-V3.2" } } },
  models: {
    mode: "merge",
    providers: {
      aiping: {
        baseUrl: "https://aiping.cn/api/v1",
        apiKey: "${AIPING_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "DeepSeek-V3.2",
            name: "DeepSeek V3.2",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 131072,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

## Notes

- Provider env var: `AIPING_API_KEY`
- Default model ref used by onboarding: `aiping/DeepSeek-V3.2`
- You can switch to router mode with model `aiping/Auto` if your account enables it.
