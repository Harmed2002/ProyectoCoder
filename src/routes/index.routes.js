import { Router } from 'express';
import cartsRouter from './carts.routes.js';
import messagesRouter from './messages.routes.js';
import productRouter from './products.routes.js';
import sessionRouter from './session.routes.js';
import userRouter from './users.routes.js';

const router = Router();
router.use('/api/users', userRouter);
router.use('/api/products', productRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/messages', messagesRouter);
router.use('/api/session', sessionRouter);

export default router;