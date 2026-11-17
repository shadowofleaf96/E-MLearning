import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service';
import { notificationEvents, NOTIFICATION_EVENT } from './notifications.events';

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;
    const limitParam = req.query.limit;
    const offsetParam = req.query.offset;
    const limit =
      typeof limitParam === 'string' ? parseInt(limitParam, 10) : 20;
    const offset =
      typeof offsetParam === 'string' ? parseInt(offsetParam, 10) : 0;

    const notifications = await notificationsService.getNotifications(
      tenantId,
      userId,
      limit,
      offset
    );
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;
    const count = await notificationsService.getUnreadCount(tenantId, userId);
    res.status(200).json({ status: 'success', data: { count } });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;
    const id = req.params.id as string;
    await notificationsService.markAsRead(tenantId, userId, id);
    res.status(200).json({ status: 'success', message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;
    await notificationsService.markAllAsRead(tenantId, userId);
    res.status(200).json({ status: 'success', message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;
    const id = req.params.id as string;
    await notificationsService.deleteNotification(tenantId, userId, id);
    res
      .status(200)
      .json({ status: 'success', message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
}

export async function streamNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: userId, tenantId } = req.user!;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    res.write(
      `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`
    );

    const onNotification = (notification: any) => {
      if (
        notification.tenantId === tenantId &&
        notification.userId === userId
      ) {
        res.write(
          `data: ${JSON.stringify({ type: 'notification', data: notification })}\n\n`
        );
      }
    };

    notificationEvents.on(NOTIFICATION_EVENT, onNotification);

    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      notificationEvents.removeListener(NOTIFICATION_EVENT, onNotification);
    });
  } catch (error) {
    next(error);
  }
}
