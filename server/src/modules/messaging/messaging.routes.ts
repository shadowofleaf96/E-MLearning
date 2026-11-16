import { Router } from 'express';
import * as controller from './messaging.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import { messagingSchemas } from './messaging.validator';

const router = Router();

router.use(authenticate);

router.get('/conversations', controller.getConversations);
router.get('/unread-count', controller.getUnreadCount);
router.get('/conversation/:conversationId', controller.getMessages);
router.post(
  '/send',
  validateRequest(messagingSchemas.sendMessage),
  controller.sendMessage
);

export default router;
