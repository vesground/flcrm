import express from 'express';
import './mongoose'
import routes  from './routes';

const router = express.Router();

// Posts
router.post('/posts', routes.posts.create);
router.get('/posts',  routes.posts.list);

export default router;
