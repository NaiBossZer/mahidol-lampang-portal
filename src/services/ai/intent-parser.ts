/**
 * Intent Parser Service
 * Orchestrates OpenAI intent parsing with tool registry and context
 */

import { OpenAIClient, ParsedIntent, ExecutionPlan, createOpenAIClient } from "./openai-client";

export interface ToolContext {
  tool_key: string;
  name: string;
  description: string;
  domain: string;
  endpoint: string;
  method: string;
  risk_level: "low" | "medium" | "high" | "critical";
  permission: string;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  enabled: boolean;
  execution_mode: "sync" | "async";
}

export interface ParseResult {
  intent: ParsedIntent;
  executionPlan: ExecutionPlan;
  matchedTool: ToolContext | null;
  requiresApproval: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export class IntentParser {
  private openaiClient: OpenAIClient;
  private availableTools: Map<string, ToolContext>;

  constructor(apiKey?: string) {
    this.openaiClient = createOpenAIClient(apiKey);
    this.availableTools = new Map();
  }

  /**
   * Load available tools from the tool registry
   */
  loadTools(tools: ToolContext[]): void {
    this.availableTools.clear();
    tools.forEach((tool) => {
      if (tool.enabled) {
        this.availableTools.set(tool.tool_key, tool);
      }
    });
  }

  /**
   * Parse user intent and generate execution plan
   */
  async parse(userIntent: string): Promise<ParseResult> {
    if (this.availableTools.size === 0) {
      throw new Error("No tools available. Please load tools first.");
    }

    // Get available tools as array
    const toolsArray = Array.from(this.availableTools.values());

    // Parse intent using OpenAI
    const parsedIntent = await this.openaiClient.parseIntent(userIntent, toolsArray);

    // Find matched tool
    const matchedTool = this.availableTools.get(parsedIntent.tool) || null;

    if (!matchedTool && parsedIntent.tool !== "unknown") {
      console.warn(`Tool "${parsedIntent.tool}" not found in registry`);
    }

    // Generate execution plan
    const executionPlan = await this.openaiClient.generateExecutionPlan(parsedIntent, toolsArray);

    // Determine if approval is required
    const requiresApproval = this.determineApprovalRequirement(
      parsedIntent,
      matchedTool,
      executionPlan,
    );

    // Determine overall risk level
    const riskLevel = this.determineRiskLevel(parsedIntent, matchedTool, executionPlan);

    return {
      intent: parsedIntent,
      executionPlan,
      matchedTool,
      requiresApproval,
      riskLevel,
    };
  }

  /**
   * Determine if approval is required based on risk and tool configuration
   */
  private determineApprovalRequirement(
    intent: ParsedIntent,
    tool: ToolContext | null,
    plan: ExecutionPlan,
  ): boolean {
    // High and critical risk always require approval
    if (plan.total_risk_level === "high" || plan.total_risk_level === "critical") {
      return true;
    }

    // Tool-specific approval requirements
    if (tool && (tool.risk_level === "high" || tool.risk_level === "critical")) {
      return true;
    }

    // Certain actions always require approval
    const approvalRequiredActions = ["publish", "archive", "delete", "export"];
    if (approvalRequiredActions.includes(intent.action)) {
      return true;
    }

    // Check if any step in the plan requires approval
    return plan.steps.some((step) => step.requires_approval);
  }

  /**
   * Determine overall risk level
   */
  private determineRiskLevel(
    intent: ParsedIntent,
    tool: ToolContext | null,
    plan: ExecutionPlan,
  ): "low" | "medium" | "high" | "critical" {
    // Use plan's risk level if available
    if (plan.total_risk_level) {
      return plan.total_risk_level;
    }

    // Use tool's risk level if available
    if (tool) {
      return tool.risk_level;
    }

    // Default to medium
    return "medium";
  }

  /**
   * Validate if user has permission for the tool
   */
  validatePermission(userRole: string, tool: ToolContext): boolean {
    if (!tool.permission) {
      return true; // No permission required
    }

    // SUPER_ADMIN has all permissions
    if (userRole === "SUPER_ADMIN") {
      return true;
    }

    // Map roles to permissions (simplified - should match actual RBAC)
    const rolePermissions: Record<string, string[]> = {
      SUPER_ADMIN: ["*"],
      CONTENT_ADMIN: [
        "activities.read",
        "activities.create",
        "activities.update",
        "activities.publish",
        "cms.read",
        "cms.create",
        "cms.update",
        "cms.publish",
        "survey.read",
        "survey.create",
        "survey.update",
      ],
      OPERATIONS_ADMIN: [
        "activities.read",
        "activities.create",
        "activities.update",
        "activities.publish",
        "learning_centers.read",
        "learning_centers.create",
        "learning_centers.update",
        "survey.read",
        "survey.create",
        "survey.update",
      ],
      FACILITY_ADMIN: ["facility.read", "facility.manage", "survey.read"],
    };

    const permissions = rolePermissions[userRole] || [];

    // Check if role has wildcard permission
    if (permissions.includes("*")) {
      return true;
    }

    // Check if role has specific permission
    return permissions.includes(tool.permission);
  }

  /**
   * Extract parameters from user intent based on tool schema
   */
  extractParameters(intent: ParsedIntent, tool: ToolContext): Record<string, any> {
    const parameters: Record<string, any> = { ...intent.parameters };

    // Validate against tool's input schema
    if (tool.input_schema && Object.keys(tool.input_schema).length > 0) {
      const schema = tool.input_schema;
      const required = schema.required || [];

      // Check for required parameters
      for (const field of required) {
        if (!parameters[field]) {
          console.warn(`Missing required parameter: ${field}`);
        }
      }
    }

    return parameters;
  }

  /**
   * Get tool by key
   */
  getTool(toolKey: string): ToolContext | undefined {
    return this.availableTools.get(toolKey);
  }

  /**
   * Get all available tools
   */
  getAllTools(): ToolContext[] {
    return Array.from(this.availableTools.values());
  }

  /**
   * Get tools by domain
   */
  getToolsByDomain(domain: string): ToolContext[] {
    return Array.from(this.availableTools.values()).filter((tool) => tool.domain === domain);
  }

  /**
   * Set OpenAI API key (for runtime configuration)
   */
  setApiKey(apiKey: string): void {
    this.openaiClient = createOpenAIClient(apiKey);
  }

  /**
   * Check if parser is ready
   */
  isReady(): boolean {
    return this.availableTools.size > 0;
  }
}

/**
 * Factory function to create intent parser
 */
export function createIntentParser(apiKey?: string): IntentParser {
  return new IntentParser(apiKey);
}
