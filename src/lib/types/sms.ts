export interface SMSStats {
  code: number;
  reason: string;
  stats: Array<{
    port: number;
    slot: number;
    received: number;
    rcv_spam: number;
    sent: number;
    sent_ok: number;
    sent_failed: number;
    con_failed: number;
    unsent: number;
    sending: number;
  }>;
  count: number;
}