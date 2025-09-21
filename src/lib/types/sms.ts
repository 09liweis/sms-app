export interface SMSStats {
  code: number;
  reason: string;
  stats: Array<PortStatus>;
  count: number;
}

export interface PortStatus {
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
}