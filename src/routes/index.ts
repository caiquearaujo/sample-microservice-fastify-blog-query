import commentsRouter from './comments.router';
import commonRouter from './common.router';
import postsRouter from './posts.router';
import webhooksRouter from './webhooks.router';

export default [
	commonRouter,
	webhooksRouter.webhookToEvents,
	postsRouter.getPost,
	postsRouter.listPost,
	commentsRouter.getComment,
	commentsRouter.listComment,
];
