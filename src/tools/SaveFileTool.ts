import {
    type ToolEmitter,
    Tool,
    type ToolInput,
    JSONToolOutput,
    ToolError
  } from "bee-agent-framework/tools/base";
  import fs from 'node:fs'
  import { z } from "zod";
  import { Emitter } from "bee-agent-framework/emitter/emitter";
  import path from "node:path";
  
  export class SaveFileTool extends Tool<JSONToolOutput<string>> {
    name = "SaveFileTool";
    description = "Creates afile from a text and returns the path to the created filename";
  
  
    constructor(private readonly folder: string) {
      super()
    }
  
    public readonly emitter: ToolEmitter<ToolInput<this>, JSONToolOutput<string>> = Emitter.root.child({
      namespace: ["tool", "FileTools"],
      creator: this,
    });
  
    inputSchema() {
      return z.object({
        content: z.string().describe(
          `The document content in plain text or markdown`,
        ),
        filename: z.string().describe(
            `The filename with extension`,
          ),
      })
    }
  
    static {
      this.register();
    }
  
    protected _run(input: ToolInput<this>): JSONToolOutput<string> {
      const { content, filename } = input
   
      const file = path.join(this.folder, path.basename(filename))

      if (fs.existsSync(file)) {
        throw new ToolError(`The file already exists (${filename}).`);
      }

      fs.writeFileSync(file, content)

      return new JSONToolOutput(path.resolve(file))
    }
  }