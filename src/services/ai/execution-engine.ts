/**
 * Execution Engine Service
 * Orchestrates tool execution with hybrid sync/async model
 */

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  duration: number;
  steps: Array<{
    id: string;
    status: "pending" | "running" | "completed" | "failed";
    output?: any;
    error?: string;
    startedAt: string;
    completedAt?: string;
  }>;
}

export interface ExecutionContext {
  executionId: string;
  toolId: string;
  intent: string;
  parameters: Record<string, any>;
  executionMode: "sync" | "async";
  userId: string;
  userRole: string;
}

export interface ToolEndpoint {
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
}

export class ExecutionEngine {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  /**
   * Execute tool synchronously
   */
  async executeSync(
    context: ExecutionContext,
    toolEndpoint: ToolEndpoint,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const steps: ExecutionResult["steps"] = [];

    try {
      // Update execution status to running
      await this.updateExecutionStatus(context.executionId, "running");

      // Execute step
      const stepId = "step_1";
      steps.push({
        id: stepId,
        status: "running",
        startedAt: new Date().toISOString(),
      });

      const result = await this.callToolEndpoint(toolEndpoint, context.parameters);

      steps[0] = {
        ...steps[0],
        status: "completed",
        output: result,
        completedAt: new Date().toISOString(),
      };

      // Update execution status to completed
      await this.updateExecutionStatus(context.executionId, "completed", {
        output: result,
        steps: steps,
      });

      const duration = Date.now() - startTime;

      return {
        success: true,
        output: result,
        duration,
        steps,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      steps[0] = {
        ...steps[0],
        status: "failed",
        error: errorMessage,
        completedAt: new Date().toISOString(),
      };

      // Update execution status to failed
      await this.updateExecutionStatus(context.executionId, "failed", {
        error: errorMessage,
        steps: steps,
      });

      const duration = Date.now() - startTime;

      return {
        success: false,
        error: errorMessage,
        duration,
        steps,
      };
    }
  }

  /**
   * Execute tool asynchronously
   */
  async executeAsync(context: ExecutionContext, toolEndpoint: ToolEndpoint): Promise<void> {
    // Update execution status to running
    await this.updateExecutionStatus(context.executionId, "running");

    // Queue for background execution
    // In a real implementation, this would use a job queue like Cloudflare Queues or BullMQ
    // For now, we'll simulate async execution with a setTimeout

    setTimeout(async () => {
      try {
        const result = await this.callToolEndpoint(toolEndpoint, context.parameters);

        await this.updateExecutionStatus(context.executionId, "completed", {
          output: result,
          steps: [
            {
              id: "step_1",
              status: "completed",
              output: result,
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
            },
          ],
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await this.updateExecutionStatus(context.executionId, "failed", {
          error: errorMessage,
          steps: [
            {
              id: "step_1",
              status: "failed",
              error: errorMessage,
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
            },
          ],
        });
      }
    }, 100);
  }

  /**
   * Determine execution mode based on tool and complexity
   */
  determineExecutionMode(tool: any, parameters: Record<string, any>): "sync" | "async" {
    // Use tool's configured execution mode if available
    if (tool.execution_mode) {
      return tool.execution_mode;
    }

    // Determine based on operation type
    const asyncOperations = ["analytics", "export", "report", "batch"];
    const toolKey = tool.tool_key || "";

    if (asyncOperations.some((op) => toolKey.includes(op))) {
      return "async";
    }

    // Determine based on parameter complexity
    if (parameters && Object.keys(parameters).length > 5) {
      return "async";
    }

    // Default to sync
    return "sync";
  }

  /**
   * Call tool endpoint
   */
  private async callToolEndpoint(
    toolEndpoint: ToolEndpoint,
    parameters: Record<string, any>,
  ): Promise<any> {
    const url = new URL(toolEndpoint.endpoint, this.baseUrl);

    // Replace path parameters
    let finalUrl = url.toString();
    for (const [key, value] of Object.entries(parameters)) {
      finalUrl = finalUrl.replace(`:${key}`, String(value));
    }

    const options: RequestInit = {
      method: toolEndpoint.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
        ...(toolEndpoint.headers || {}),
      },
    };

    // Add body for POST/PATCH requests
    if (toolEndpoint.method === "POST" || toolEndpoint.method === "PATCH") {
      options.body = JSON.stringify(parameters);
    }

    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tool endpoint error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  /**
   * Update execution status in database
   */
  private async updateExecutionStatus(
    executionId: string,
    status: string,
    updates?: Record<string, any>,
  ): Promise<void> {
    // This would call the database to update the execution record
    // For now, this is a placeholder
    console.log(`Updating execution ${executionId} to status: ${status}`, updates);
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(executionId: string): Promise<any> {
    // This would fetch the execution record from the database
    // For now, this is a placeholder
    console.log(`Getting status for execution ${executionId}`);
    return null;
  }

  /**
   * Cancel execution
   */
  async cancelExecution(executionId: string): Promise<void> {
    // This would cancel a running execution
    // For now, this is a placeholder
    console.log(`Cancelling execution ${executionId}`);
  }

  /**
   * Retry failed execution
   */
  async retryExecution(executionId: string): Promise<ExecutionResult> {
    // This would retry a failed execution
    // For now, this is a placeholder
    console.log(`Retrying execution ${executionId}`);
    return {
      success: false,
      error: "Retry not implemented",
      duration: 0,
      steps: [],
    };
  }

  /**
   * Set base URL (for testing or different environments)
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Set auth token (for testing or different users)
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }
}

/**
 * Factory function to create execution engine
 */
export function createExecutionEngine(baseUrl: string, authToken: string): ExecutionEngine {
  return new ExecutionEngine(baseUrl, authToken);
}
