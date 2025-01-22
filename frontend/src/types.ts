export interface IThread {
  messages: IMessage[];
  title: string;
  id: string;
}

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
} 