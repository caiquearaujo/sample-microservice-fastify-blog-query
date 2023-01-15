import { FastifyInstance } from 'fastify';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import routes from '@/routes';
import plugins from '@/server/plugins';
import PostRepository, {
	ICommentRecord,
} from '@/repositories/PostRepository';

let app: FastifyInstance;

beforeAll(async () => {
	const api = new ApiServer({
		routes: new FastifyApplierGroup(...routes),
		plugins: new FastifyApplierGroup(...plugins),
	});

	await api.bootstrap();
	app = api.app;

	PostRepository.fresh();

	PostRepository.create({
		id: '1',
		title: 'My first post',
		content: 'This is my first post',
		status: 'draft',
	});
});

describe('Comments Routes', () => {
	let postId = '1';
	let createdComment: ICommentRecord;

	it('GET /posts/:id/comments -> should return empty comments', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/posts/${postId}/comments`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(404);
		expect(body).toStrictEqual({
			status: 404,
			name: 'CommentsNotFound',
			message: 'No comments were found.',
		});
	});

	it('GET /posts/:id/comments/:commentid -> can get an existing comment', async () => {
		createdComment = PostRepository.addComment(postId, {
			id: 'anycommentid',
			author: 'Bruce Wayne',
			content: 'I am Batman',
			status: 'pending',
		});

		const response = await app.inject({
			method: 'GET',
			url: `/posts/${postId}/comments/${createdComment.id}`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(200);
		expect(body.id).toBe(createdComment.id);
		expect(body.author).toBe('Bruce Wayne');
		expect(body.content).toBe('I am Batman');
		expect(body.status).toBe('pending');
	});

	it('GET /posts/:id/comments/:commentid -> cannot get a post', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/posts/unknown/comments/unknown`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(404);
		expect(body).toStrictEqual({
			status: 404,
			name: 'CommentNotFound',
			message: 'Requested comment was not found.',
		});
	});

	it('GET /posts/:id/comments/:commentid -> cannot get a comment', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/posts/${postId}/comments/unknown`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(404);
		expect(body).toStrictEqual({
			status: 404,
			name: 'CommentNotFound',
			message: 'Requested comment was not found.',
		});
	});

	it('GET /posts/:id/comments/ -> can get all existing comments', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/posts/${postId}/comments`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(200);
		expect(body.length).toBe(1);
		expect(body[0].id).toBe(createdComment.id);
		expect(body[0].author).toBe('Bruce Wayne');
		expect(body[0].content).toBe('I am Batman');
		expect(body[0].status).toBe('pending');
	});
});
