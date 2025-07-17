// Message status enum for local use
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Reply category enum for local use
export enum ReplyCategory {
  AGREEMENT = 'agreement',
  QUESTION = 'question',
  RESPONSE = 'response',
  GREETING = 'greeting',
  FAREWELL = 'farewell',
  EMOJI = 'emoji'
}