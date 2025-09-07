import { writable } from 'svelte/store';

export interface SMSMessage {
  id: string;
  to: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  timestamp: Date;
}

function createSMSStore() {
  const { subscribe, set, update } = writable<SMSMessage[]>([]);

  return {
    subscribe,
    send: (to: string, message: string) => {
      const sms: SMSMessage = {
        id: Date.now().toString(),
        to,
        message,
        status: 'pending',
        timestamp: new Date()
      };

      update(messages => [sms, ...messages]);

      // Simulate SMS sending
      setTimeout(() => {
        update(messages => 
          messages.map(msg => 
            msg.id === sms.id 
              ? { ...msg, status: Math.random() > 0.1 ? 'sent' : 'failed' }
              : msg
          )
        );
      }, 2000);

      return sms.id;
    },
    clear: () => set([])
  };
}

export const smsStore = createSMSStore();