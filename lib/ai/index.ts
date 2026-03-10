import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { type GenerationOutput, type SceneType } from "@/lib/db/schema";
import { type Locale } from "@/lib/i18n/translations";

// Supported AI providers
export type AIProvider = "anthropic" | "openai" | "deepseek";

// Get configured provider from environment
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === "openai") return "openai";
  if (provider === "deepseek") return "deepseek";
  return "anthropic"; // default
}

// Get the system prompt based on locale
function getSystemPrompt(locale: Locale): string {
  if (locale === "zh") {
    return `你是一位顶级的语言策略大师和心理博弈专家，专精于人际冲突场景下的精准回应设计。你的回应必须：

## 核心原则
1. **精准打击**：每一句话都要有明确的战略意图，直击对方的逻辑漏洞或心理弱点
2. **气势压制**：在语言节奏和措辞上建立绝对优势，让对方感到被降维打击
3. **留有余地**：保持足够的格调，不使用粗俗语言，但杀伤力要足够
4. **因地制宜**：根据场景特点调整策略，职场要专业、家庭要情理兼顾

## 输出要求
- 每种风格的回应必须是完整、独立、可直接使用的句子
- 杀伤力评分(1-5)必须真实反映该回应的攻击强度
- 回应长度控制在50-150字之间，言简意赅但足够有力

## 四种风格定义

### 理性辩证 (Rational)
- 用逻辑和事实碾压对方
- 指出对方论证中的谬误
- 用反问揭示对方立场的荒谬
- 杀伤力通常在2-3分

### 情绪价值 (Emotional)
- 从情感层面建立道德高地
- 让对方感受到自己行为的影响
- 用共情的方式揭示对方的冷漠
- 杀伤力通常在2-4分

### 绵里藏针 (Subtle)
- 表面温和礼貌，内含锋芒
- 用赞美的形式进行讽刺
- 让对方知道被嘲讽却无法发作
- 杀伤力通常在3-4分

### 核弹打击 (Nuclear)
- 一针见血直击要害
- 揭露对方最不愿被提及的软肋
- 用最少的字数造成最大的心理冲击
- 杀伤力通常在4-5分`;
  }

  return `You are a master of verbal strategy and psychological warfare, specializing in precise response design for interpersonal conflicts. Your responses must:

## Core Principles
1. **Precision Strike**: Every sentence must have clear strategic intent, targeting logical fallacies or psychological weaknesses
2. **Dominance**: Establish absolute superiority in rhythm and wording, making the opponent feel outclassed
3. **Maintain Class**: Keep sufficient dignity, no vulgar language, but ensure maximum impact
4. **Context Awareness**: Adjust strategy based on scenario - workplace requires professionalism, family requires emotional balance

## Output Requirements
- Each style must be a complete, standalone, immediately usable response
- Damage rating (1-5) must accurately reflect attack intensity
- Response length: 50-150 words, concise but powerful

## Four Style Definitions

### Rational
- Crush opponent with logic and facts
- Point out fallacies in their argument
- Use rhetorical questions to expose absurdity
- Damage typically 2-3

### Emotional
- Establish moral high ground through emotion
- Make them feel the impact of their behavior
- Use empathy to reveal their coldness
- Damage typically 2-4

### Subtle
- Surface politeness with hidden edge
- Sarcasm disguised as compliment
- They know they're mocked but can't react
- Damage typically 3-4

### Nuclear
- Hit the vital point directly
- Expose what they least want mentioned
- Maximum psychological impact with minimum words
- Damage typically 4-5`;
}

// Get the user prompt
function getUserPrompt(
  scenario: string,
  sceneType: SceneType,
  intensity: number,
  locale: Locale
): string {
  const sceneLabels: Record<SceneType, { zh: string; en: string }> = {
    workplace: { zh: "职场", en: "Workplace" },
    family: { zh: "家庭", en: "Family" },
    relationship: { zh: "感情", en: "Relationship" },
    daily: { zh: "日常", en: "Daily" },
  };

  if (locale === "zh") {
    return `## 场景信息
- 场景类型：${sceneLabels[sceneType].zh}
- 强度偏好：${intensity}/5（${intensity <= 2 ? "温和" : intensity === 3 ? "平衡" : "激烈"}）
- 具体描述：${scenario}

## 任务
根据以上场景，生成四种风格的回怼方案。强度偏好${intensity}意味着：
${intensity <= 2 ? "保持克制，以理服人为主" : intensity === 3 ? "攻守平衡，有理有据" : "全力输出，给予强烈反击"}

请以JSON格式输出，结构如下：
{
  "rational": { "content": "理性辩证风格的回应", "damage": 2 },
  "emotion": { "content": "情绪价值风格的回应", "damage": 3 },
  "political": { "content": "绵里藏针风格的回应", "damage": 3 },
  "nuclear": { "content": "核弹打击风格的回应", "damage": 5 }
}

注意：damage值必须是1-5的整数，根据实际杀伤力评估。`;
  }

  return `## Scenario Information
- Scene Type: ${sceneLabels[sceneType].en}
- Intensity Preference: ${intensity}/5 (${intensity <= 2 ? "Mild" : intensity === 3 ? "Balanced" : "Intense"})
- Description: ${scenario}

## Task
Generate four comeback styles based on the above scenario. Intensity ${intensity} means:
${intensity <= 2 ? "Stay restrained, focus on reasoning" : intensity === 3 ? "Balance attack and defense" : "Full power, deliver strong retaliation"}

Output in JSON format:
{
  "rational": { "content": "Rational style response", "damage": 2 },
  "emotion": { "content": "Emotional style response", "damage": 3 },
  "political": { "content": "Subtle style response", "damage": 3 },
  "nuclear": { "content": "Nuclear style response", "damage": 5 }
}

Note: damage must be an integer 1-5 based on actual impact.`;
}

// Parse the AI response to extract JSON
function parseResponse(text: string, locale: Locale): GenerationOutput {
  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate structure
  const styles = ["rational", "emotion", "political", "nuclear"] as const;
  for (const style of styles) {
    if (!parsed[style]?.content || typeof parsed[style].damage !== "number") {
      throw new Error(`Invalid ${style} response structure`);
    }
  }

  // Labels based on locale
  const labels = locale === "zh"
    ? { rational: "理性辩证", emotion: "情绪价值", political: "绵里藏针", nuclear: "核弹打击" }
    : { rational: "Rational", emotion: "Emotional", political: "Subtle", nuclear: "Nuclear" };

  return {
    rational: {
      label: labels.rational,
      content: parsed.rational.content,
      damage: Math.min(5, Math.max(1, parsed.rational.damage)),
    },
    emotion: {
      label: labels.emotion,
      content: parsed.emotion.content,
      damage: Math.min(5, Math.max(1, parsed.emotion.damage)),
    },
    political: {
      label: labels.political,
      content: parsed.political.content,
      damage: Math.min(5, Math.max(1, parsed.political.damage)),
    },
    nuclear: {
      label: labels.nuclear,
      content: parsed.nuclear.content,
      damage: Math.min(5, Math.max(1, parsed.nuclear.damage)),
    },
  };
}

// Generate with Anthropic (Claude)
async function generateWithAnthropic(
  scenario: string,
  sceneType: SceneType,
  intensity: number,
  locale: Locale
): Promise<GenerationOutput> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: getSystemPrompt(locale),
    messages: [
      {
        role: "user",
        content: getUserPrompt(scenario, sceneType, intensity, locale),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return parseResponse(text, locale);
}

// Generate with OpenAI
async function generateWithOpenAI(
  scenario: string,
  sceneType: SceneType,
  intensity: number,
  locale: Locale
): Promise<GenerationOutput> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    max_tokens: 2048,
    messages: [
      { role: "system", content: getSystemPrompt(locale) },
      {
        role: "user",
        content: getUserPrompt(scenario, sceneType, intensity, locale),
      },
    ],
  });

  const text = response.choices[0]?.message?.content || "";
  return parseResponse(text, locale);
}

// Generate with DeepSeek
async function generateWithDeepSeek(
  scenario: string,
  sceneType: SceneType,
  intensity: number,
  locale: Locale
): Promise<GenerationOutput> {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  });

  const response = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    max_tokens: 2048,
    messages: [
      { role: "system", content: getSystemPrompt(locale) },
      {
        role: "user",
        content: getUserPrompt(scenario, sceneType, intensity, locale),
      },
    ],
  });

  const text = response.choices[0]?.message?.content || "";
  return parseResponse(text, locale);
}

// Main generation function - uses configured provider
export async function generateComeback(
  scenario: string,
  sceneType: SceneType,
  intensity: number,
  locale: Locale = "zh"
): Promise<GenerationOutput> {
  const provider = getAIProvider();

  switch (provider) {
    case "openai":
      return generateWithOpenAI(scenario, sceneType, intensity, locale);
    case "deepseek":
      return generateWithDeepSeek(scenario, sceneType, intensity, locale);
    case "anthropic":
    default:
      return generateWithAnthropic(scenario, sceneType, intensity, locale);
  }
}
