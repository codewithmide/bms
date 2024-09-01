import { supabase } from "./supabase";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  created_at: string;
}

interface Conversation {
  recipientEmail: string;
  lastMessage: string;
  timestamp: string;
}

class SupabaseMessagingService {
  async sendMessage(sender: string, recipient: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert({ sender, recipient, content });
    
    if (error) throw error;
  }

  async receiveMessages(userEmail: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`recipient.eq.${userEmail},sender.eq.${userEmail}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getConversations(userEmail: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`recipient.eq.${userEmail},sender.eq.${userEmail}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const conversations: { [key: string]: Conversation } = {};

    data?.forEach(message => {
      const otherParty = message.sender === userEmail ? message.recipient : message.sender;
      if (!conversations[otherParty]) {
        conversations[otherParty] = {
          recipientEmail: otherParty,
          lastMessage: message.content,
          timestamp: message.created_at
        };
      }
    });

    return Object.values(conversations);
  }

  async getConversationMessages(userEmail: string, otherEmail: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender.eq.${userEmail},recipient.eq.${otherEmail}),and(sender.eq.${otherEmail},recipient.eq.${userEmail})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}

export const supabaseMessagingService = new SupabaseMessagingService();