import { Router } from 'express';
import * as controller from './live.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, controller.getSessions);
router.get('/module/:moduleId', authenticate, controller.getSessionsByModule);
router.get('/:id', authenticate, controller.getSessionById);
router.post('/', authenticate, controller.createSession);
router.put('/:id', authenticate, controller.updateSession);
router.delete('/:id', authenticate, controller.deleteSession);
router.post('/:id/join', authenticate, controller.joinSession);
router.post('/:id/leave', authenticate, controller.leaveSession);

export default router;
