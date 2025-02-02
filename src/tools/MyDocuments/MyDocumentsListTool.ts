import {
  ToolEmitter,
  Tool,
  ToolInput,
  JSONToolOutput  
} from "bee-agent-framework/tools/base";
import fs from 'node:fs'
import { z } from "zod";
import { Emitter } from "bee-agent-framework/emitter/emitter";
import { basename } from "node:path";

export class MyDocumentsListTool extends Tool<JSONToolOutput<string[]>> {
  name = "MyDocumentsListTool";
  description = "Returns the list of documents files names.";


  constructor(private readonlyfolder: string) {
    super()
  }

  public readonly emitter: ToolEmitter<ToolInput<this>, JSONToolOutput<string[]>> = Emitter.root.child({
    namespace: ["tool", "MyDocuments"],
    creator: this,
  });

  inputSchema() {
    return z.object({
      filter: z.string().optional().describe(
        `A regex to filter documents by name`,
      ),
    })
  }

  static {
    this.register();
  }

  protected async _run(input: ToolInput<this>): Promise<JSONToolOutput<string[]>> {
    const filter = input.filter
 
    const regex = new RegExp(filter || '')

    const files = fs.readdirSync(this.folder).map(file => basename(file)).filter(file => {
      return !filter || regex.test(file)
    })

    return new JSONToolOutput(files);
  }
}