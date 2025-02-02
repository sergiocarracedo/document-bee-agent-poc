import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { OllamaChatLLM } from "bee-agent-framework/adapters/ollama/chat";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { createConsoleReader } from "../helpers/io";
import { MyDocumentsListTool } from "../tools/MyDocuments/MyDocumentsListTool"
import { MyDocumentsReadTool } from "../tools/MyDocuments/MyDocumentsReadTool"
import { SaveFileTool } from  "../tools/SaveFileTool"
import { join } from "node:path"
import { FrameworkError } from "bee-agent-framework/errors";
import { Logger } from "bee-agent-framework/logger/logger";
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

Logger.root.level = "silent"; // disable internal logs
const logger = new Logger({ name: "app", level: "trace" });

const documentsFolder = join(__dirname, '..', '..', 'documents')

const llm = new OllamaChatLLM();

const agent = new BeeAgent({
  llm, // for more explore 'bee-agent-framework/adapters'
  memory: new TokenMemory({ llm }), // for more explore 'bee-agent-framework/memory'
  tools: [new MyDocumentsListTool(documentsFolder), new MyDocumentsReadTool(documentsFolder), new SaveFileTool(documentsFolder)], // for more explore 'bee-agent-framework/tools'
});



const reader = createConsoleReader();
try {
    for await (const { prompt } of reader) {
      const response = await agent
        .run(
          { prompt },
          {
            execution: {
              maxRetriesPerStep: 3,
              totalMaxRetries: 10,
              maxIterations: 20,
            },
          },
        )
        .observe((emitter) => {
          // emitter.on("start", () => {
          //   reader.write(`Agent 🤖 : `, "starting new iteration");
          // });
          emitter.on("error", ({ error }) => {
            reader.write(`Agent 🤖 : `, FrameworkError.ensure(error).dump());
          });
          emitter.on("retry", () => {
            reader.write(`Agent 🤖 : `, "retrying the action...");
          });
          emitter.on("update", async ({ data, update, meta }) => {
            // log 'data' to see the whole state
            // to log only valid runs (no errors), check if meta.success === true
            reader.write(`Agent (${update.key}) 🤖 : `, update.value);
          });
          emitter.on("partialUpdate", ({ data, update, meta }) => {
            // ideal for streaming (line by line)
            // log 'data' to see the whole state
            // to log only valid runs (no errors), check if meta.success === true
            // reader.write(`Agent (partial ${update.key}) 🤖 : `, update.value);
          });
  
          // To observe all events (uncomment following block)
          // emitter.match("*.*", async (data: unknown, event) => {
          //   console.log(event, `Received event "${event.path}"`);
          // });
  
          // To get raw LLM input (uncomment following block)
          // emitter.match(
          //   (event) => event.creator === llm && event.name === "start",
          //   async (data: InferCallbackValue<GenerateEvents["start"]>, event) => {
          //     logger.trace(
          //       event,
          //       [
          //         `Received LLM event "${event.path}"`,
          //         JSON.stringify(data.input), // array of messages
          //       ].join("\n"),
          //     );
          //   },
          // );
        });
  
      reader.write(`Agent 🤖 : `, response.result.text);
    }
  } catch (error) {
    logger.error(FrameworkError.ensure(error).dump());
  } finally {
    reader.close();
  }