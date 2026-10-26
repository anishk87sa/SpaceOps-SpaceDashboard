import { Router } from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmarks.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:itemId', removeBookmark);

export default router;
