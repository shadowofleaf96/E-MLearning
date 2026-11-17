import { EventEmitter } from 'events';

class NotificationEventEmitter extends EventEmitter {}

export const notificationEvents = new NotificationEventEmitter();

// Limit listener warnings
notificationEvents.setMaxListeners(200);

export const NOTIFICATION_EVENT = 'new_notification';
