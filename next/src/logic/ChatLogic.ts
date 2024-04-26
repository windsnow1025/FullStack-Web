import ChatService, {StreamResponse} from "../service/ChatService";
import {Message} from "../model/Message"

interface ApiTypeModel {
  api_type: string;
  model: string
}

export class ChatLogic {
  private chatService: ChatService;
  public initMessages: Message[];
  public emptyUserMessage: Message;
  public emptyAssistantMessage: Message;
  public defaultApiType: string;
  public defaultModel: ApiTypeModel[];

  constructor() {

    this.chatService = new ChatService();

    this.initMessages = [
      {
        "role": "system",
        "text": "You are a helpful assistant.",
        "files": []
      },
      {
        "role": "user",
        "text": "",
        "files": []
      }
    ];

    this.emptyUserMessage = {
      "role": "user",
      "text": "",
      "files": []
    };
    this.emptyAssistantMessage = {
      "role": "assistant",
      "text": "",
      "files": []
    };

    this.defaultApiType = "open_ai";
    this.defaultModel = [
      {"api_type": "open_ai", "model": "gpt-4-turbo"},
      {"api_type": "azure", "model": "gpt-4"},
      {"api_type": "gemini", "model": "gemini-1.5-pro-latest"}
    ]
  }

  createAssistantMessage(text: string) {
    const message: Message = {
      "role": "assistant",
      "text": text,
      "files": []
    }
    return message;
  }

  async fetchModels() {
    try {
      return await this.chatService.fetchModels();
    } catch (err) {
      console.error("Error in GET /models:", err);
      return "Error occurred while fetching models.";
    }
  }

  getModels(models: ApiTypeModel, apiType: string) {
    if(!Array.isArray(models)) {
      return this.defaultModel
        .filter(model => model.api_type === apiType)
        .map(model => model.model);
    }
    return models
      .filter(model => model.api_type === apiType)
      .map(model => model.model);
  }

  async nonStreamGenerate(messages: Message[], api_type: string, model: string, temperature: number, stream: boolean) {
    try {
      const content = await this.chatService.generate(messages, api_type, model, temperature, stream) as string;
      return this.sanitize(content);
    } catch (err) {
      console.error("Error in POST /:", err);
      return "Error occurred while generating data.";
    }
  }

  async *streamGenerate(messages: Message[], api_type: string, model: string, temperature: number, stream: boolean) {
    let controller;

    try {

      const response = await this.chatService.generate(messages, api_type, model, temperature, stream) as StreamResponse;
      controller = response.controller;
      const reader = response.reader;

      while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        yield this.sanitize(new TextDecoder().decode(value));
      }

    } catch (err) {
      console.error("Error in POST /:", err);
      return "Error occurred while generating data.";
    } finally {
      if (controller) {
        controller.abort();
      }
    }
  }

  sanitize(content: string) {
    return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Save the messages array as a JSON file
  export(messages: Message[]) {
    const fileName = 'messages.json';
    const data = JSON.stringify(messages);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  // Load the messages array from a JSON file
  import() {
    return new Promise((resolve, reject) => {
      // Request a JSON file from the user
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = e => {
        // Get the file
        const target = e.target as HTMLInputElement;
        const files = target.files as FileList;
        const file = files[0];

        // Read the file
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = readerEvent => {
          const content = readerEvent.target?.result as string;

          // Parse the JSON file
          const messages = JSON.parse(content);

          // Resolve the promise with the messages
          resolve(messages);
        }

        // Reject the promise if there's an error
        reader.onerror = error => reject(error);
      }
      input.click();

      // Scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
}