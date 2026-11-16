import { Request, Response, NextFunction } from 'express';
import { campaignsService } from './campaigns.service';

export async function getCampaigns(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const campaigns = await campaignsService.getCampaigns(tenantId);
    res.status(200).json({ status: 'success', data: campaigns });
  } catch (error) {
    next(error);
  }
}

export async function createCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;

    // Default mock data for a "mock" send since no SMTP provider is connected
    const status = req.body.status || 'Draft';
    const sentAt = status === 'Sent' ? new Date() : null;
    const recipientCount =
      status === 'Sent' ? Math.floor(Math.random() * 5000) + 1000 : 0;
    const openRate = status === 'Sent' ? Math.random() * 80 + 10 : 0;
    const clickRate = status === 'Sent' ? Math.random() * 30 + 5 : 0;

    const campaignData = {
      ...req.body,
      status,
      sentAt,
      recipientCount,
      openRate,
      clickRate,
    };

    const campaign = await campaignsService.createCampaign(
      tenantId,
      campaignData
    );
    res.status(201).json({ status: 'success', data: campaign });
  } catch (error) {
    next(error);
  }
}

export async function updateCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const { id } = req.params;
    await campaignsService.updateCampaign(tenantId, id, req.body);
    res.status(200).json({ status: 'success', message: 'Campaign updated' });
  } catch (error) {
    next(error);
  }
}

export async function deleteCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const { id } = req.params;
    await campaignsService.deleteCampaign(tenantId, id);
    res.status(200).json({ status: 'success', message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
}
