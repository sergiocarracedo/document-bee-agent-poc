import {
  ToolEmitter,
  Tool,
  ToolError,
  ToolInput,
  StringToolOutput
} from "bee-agent-framework/tools/base";
import fs from 'node:fs'
import { z } from "zod";
import { Emitter } from "bee-agent-framework/emitter/emitter";
import path from 'node:path'

export class MyDocumentsReadTool extends Tool<StringToolOutput> {
  name = "MyDocumentsReadTool";
  description = "Returns the content of a document file";


  constructor(private folder: string) {
    super()
  }

  public readonly emitter: ToolEmitter<ToolInput<this>, StringToolOutput> = Emitter.root.child({
    namespace: ["tool", "MyDocuments"],
    creator: this,
  });

  inputSchema() {
    return z.object({
      name: z.string().describe(
        `The document file name including the extension`,
      ),
    })
  }

  static {
    this.register();
  }

  protected async _run(input: ToolInput<this>): Promise<StringToolOutput> {
    try {
      const content = fs.readFileSync(path.join(this.folder, input.name)).toString()
      return new StringToolOutput(content)
    } catch (e) {
      throw new ToolError(`Failed to read the content of the file (${input.name}).`);
    }

  }
}