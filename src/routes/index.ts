import commonRouter from './common.router';
import webhooksRouter from './webhooks.router';

export default [commonRouter, webhooksRouter.webhookToEvents];
