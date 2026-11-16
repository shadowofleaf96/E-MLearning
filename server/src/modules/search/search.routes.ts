import { Router } from 'express';
import * as controller from './search.controller';
import { optionalAuthenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', optionalAuthenticate, controller.search);

export default router;
