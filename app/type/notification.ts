export type NotificationType =
  | "POST_LIKE"
  | "POST_COMMENT"
  | "CONNECTION_ACCEPTED";

export interface SenderProfile {
  image?: string;
}

export interface Sender {
  id: string;
  name: string;
  profile?: SenderProfile;
}

export interface Notification {
  id: string;
  isRead: boolean;
  type: NotificationType;
  message: string;
  entityId?: string;
  senderId?: string;
  sender?: Sender;
  createdAt?: string;
}
