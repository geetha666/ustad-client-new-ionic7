// api-ai-javascript.d.ts

declare module 'api-ai-javascript/es6/ApiAiClient' {
    export class ApiAiClient {
      constructor(options: { accessToken: string });
      textRequest(request: { query: string }): Promise<any>;
      // Add other methods and properties as needed
    }
  }
  