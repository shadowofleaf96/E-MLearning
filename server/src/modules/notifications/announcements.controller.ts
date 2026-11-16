import { Request, Response, NextFunction } from 'express';
import { announcementsService } from './announcements.service';

export async function getAnnouncements(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const announcements = await announcementsService.getAnnouncements(tenantId);
    res.status(200).json({ status: 'success', data: announcements });
  } catch (error) {
    next(error);
  }
}

export async function createAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const announcement = await announcementsService.createAnnouncement(
      tenantId,
      req.body
    );
    res.status(201).json({ status: 'success', data: announcement });
  } catch (error) {
    next(error);
  }
}

export async function updateAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const id = req.params.id as string;
    await announcementsService.updateAnnouncement(tenantId, id, req.body);
    res
      .status(200)
      .json({ status: 'success', message: 'Announcement updated' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const id = req.params.id as string;
    await announcementsService.deleteAnnouncement(tenantId, id);
    res
      .status(200)
      .json({ status: 'success', message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
}
