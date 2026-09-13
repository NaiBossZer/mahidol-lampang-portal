/**
 * OpenAI Client for AI Intent Processing
 * Handles communication with OpenAI API for natural language understanding
 */

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ParsedIntent {
  domain: string;
  action: string;
  tool: string;
  parameters: Record<string, any>;
  confidence: number;
  reasoning: string;
}

export interface ExecutionPlan {
  steps: Array<{
    id: string;
    title: string;
    description: string;
    tool: string;
    parameters: Record<string, any>;
    risk_level: "low" | "medium" | "high" | "critical";
    requires_approval: boolean;
  }>;
  estimated_duration: string;
  total_risk_level: "low" | "medium" | "high" | "critical";
}

export class OpenAIClient {
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1";
  private model = "gpt-4o-mini"; // Cost-effective model for intent parsing

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Parse natural language intent into structured format
   */
  async parseIntent(
    userIntent: string,
    availableTools: Array<{ tool_key: string; name: string; description: string; domain: string }>,
  ): Promise<ParsedIntent> {
    const systemPrompt = this.buildSystemPrompt(availableTools);
    const userPrompt = this.buildUserPrompt(userIntent);

    try {
      const response = await this.callOpenAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return this.parseResponse(response);
    } catch (error) {
      console.error("OpenAI intent parsing failed:", error);
      throw new Error(
        `Failed to parse intent: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Generate execution plan for a parsed intent
   */
  async generateExecutionPlan(
    intent: ParsedIntent,
    availableTools: Array<any>,
  ): Promise<ExecutionPlan> {
    const systemPrompt = `You are an AI execution planner. Generate step-by-step execution plans for AI operations.
Return response as JSON with this structure:
{
  "steps": [
    {
      "id": "step_1",
      "title": "Step title",
      "description": "Detailed description",
      "tool": "tool_key",
      "parameters": {},
      "risk_level": "low|medium|high|critical",
      "requires_approval": boolean
    }
  ],
  "estimated_duration": "time estimate",
  "total_risk_level": "low|medium|high|critical"
}`;

    const userPrompt = `Generate execution plan for this intent:
Domain: ${intent.domain}
Action: ${intent.action}
Tool: ${intent.tool}
Parameters: ${JSON.stringify(intent.parameters)}
Reasoning: ${intent.reasoning}

Available tools: ${JSON.stringify(availableTools.map((t) => ({ tool_key: t.tool_key, name: t.name, risk_level: t.risk_level })))}`;

    try {
      const response = await this.callOpenAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const plan = JSON.parse(response);
      return plan as ExecutionPlan;
    } catch (error) {
      console.error("OpenAI execution plan generation failed:", error);
      // Fallback to simple plan
      return this.generateFallbackPlan(intent);
    }
  }

  /**
   * Build system prompt for intent parsing
   */
  private buildSystemPrompt(availableTools: Array<any>): string {
    const toolsList = availableTools
      .map((tool) => `- ${tool.tool_key}: ${tool.name} (${tool.domain}) - ${tool.description}`)
      .join("\n");

    return `You are an AI intent parser for Mahidol Lampang Portal. Parse natural language commands into structured intents.

Available tools:
${toolsList}

Return response as JSON with this exact structure:
{
  "domain": "activities|survey|analytics|learning_centers|cms|organizations",
  "action": "list|get|create|update|publish|archive|analytics|export",
  "tool": "exact tool_key from available tools",
  "parameters": { /* extracted parameters */ },
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of why this tool was chosen"
}

Rules:
- Only return tools that exist in the available tools list
- Extract parameters from the user's request
- Set confidence based on how clear the intent is
- If no tool matches, return tool as "unknown" and confidence as 0.0`;
  }

  /**
   * Build user prompt for intent parsing
   */
  private buildUserPrompt(userIntent: string): string {
    return `Parse this user command: "${userIntent}"`;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.3, // Lower temperature for more consistent parsing
        max_tokens: 500,
        response_format: { type: "json_object" }, // Ensure JSON response
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || "{}";
  }

  /**
   * Parse OpenAI response into ParsedIntent
   */
  private parseResponse(response: string): ParsedIntent {
    try {
      const parsed = JSON.parse(response);

      // Validate required fields
      if (!parsed.domain || !parsed.action || !parsed.tool) {
        throw new Error("Missing required fields in parsed intent");
      }

      return {
        domain: parsed.domain,
        action: parsed.action,
        tool: parsed.tool,
        parameters: parsed.parameters || {},
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || "No reasoning provided",
      };
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      throw new Error("Invalid response format from OpenAI");
    }
  }

  /**
   * Generate fallback execution plan if OpenAI fails
   */
  private generateFallbackPlan(intent: ParsedIntent): ExecutionPlan {
    return {
      steps: [
        {
          id: "step_1",
          title: `Execute ${intent.tool}`,
          description: `Execute ${intent.action} operation on ${intent.domain}`,
          tool: intent.tool,
          parameters: intent.parameters,
          risk_level: "medium",
          requires_approval: false,
        },
      ],
      estimated_duration: "unknown",
      total_risk_level: "medium",
    };
  }

  /**
   * Set custom model (for testing or cost optimization)
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.model;
  }
}

/**
 * Factory function to create OpenAI client
 * Reads API key from environment or uses provided key
 */
export function createOpenAIClient(apiKey?: string): OpenAIClient {
  const key = apiKey || process.env.OPENAI_API_KEY || "";
  return new OpenAIClient(key);
}
