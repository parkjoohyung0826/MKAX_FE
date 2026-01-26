export interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}
