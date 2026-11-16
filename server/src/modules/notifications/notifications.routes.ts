import express from 'express';
import { authenticate } from '../../middlewares/authenticate';
import * as notificationsController from './notifications.controller';
import * as announcementsController from './announcements.controller';
import * as campaignsController from './campaigns.controller';

const router = express.Router();

router.use(authenticate);

// Base notifications routes
router.get('/', notificationsController.getNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.put('/mark-all-read', notificationsController.markAllAsRead);
router.put('/:id/read', notificationsController.markAsRead);
router.delete('/:id', notificationsController.deleteNotification);

// Announcements routes
router.get('/announcements', announcementsController.getAnnouncements);
router.post('/announcements', announcementsController.createAnnouncement);
router.put('/announcements/:id', announcementsController.updateAnnouncement);
router.delete('/announcements/:id', announcementsController.deleteAnnouncement);

// Campaigns routes
router.get('/campaigns', campaignsController.getCampaigns);
router.post('/campaigns', campaignsController.createCampaign);
router.post('/campaigns/:id/send', campaignsController.sendCampaign);
router.put('/campaigns/:id', campaignsController.updateCampaign);
router.delete('/campaigns/:id', campaignsController.deleteCampaign);

export default router;
