import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type NotificationType = 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_completed';

export interface NotificationData {
  userId: string;
  type: NotificationType;
  message: string;
  bookingId: string;
  read: boolean;
  createdAt: any;
}

export const createNotification = async (
  userId: string,
  type: NotificationType,
  message: string,
  bookingId: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      message,
      bookingId,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    // Non-critical, so we don't throw, but log
  }
};
