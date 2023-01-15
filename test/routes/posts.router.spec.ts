import { FastifyInstance } from 'fastify';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import PostRepository, {
	IPostRecord,
} from '@/repositories/PostRepository';
import routes from '@/routes';
import plugins from '@/server/plugins';

let app: FastifyInstance;

beforeAll(async () => {
	const api = new ApiServer({
		routes: new FastifyApplierGroup(...routes),
		plugins: new FastifyApplierGroup(...plugins),
	});

	await api.bootstrap();
	app = api.app;

	PostRepository.fresh();
});

describe('Posts Routes', () => {
	let createdPost: IPostRecord;

	it('GET /posts -> should return empty posts', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/posts',
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(404);
		expect(body).toStrictEqual({
			status: 404,
			name: 'PostsNotFound',
			message: 'No posts were found.',
		});
	});

	it('GET /posts/:id -> can get an existing post', async () => {
		createdPost = PostRepository.create({
			id: '1',
			title: 'My first post',
			content: 'This is my first post',
			status: 'draft',
		});

		const response = await app.inject({
			method: 'GET',
			url: `/posts/${createdPost.id}`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(200);
		expect(body.id).toBe(createdPost.id);
		expect(body.title).toBe('My first post');
		expect(body.content).toBe('This is my first post');
		expect(body.status).toBe('draft');
	});

	it('GET /posts/:id -> cannot get a post', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/posts/unknown',
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(404);
		expect(body).toStrictEqual({
			status: 404,
			name: 'PostNotFound',
			message: 'Requested post was not found.',
		});
	});

	it('GET /posts -> can get all existing posts', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/posts`,
		});

		const body = JSON.parse(response.body);

		expect(response.statusCode).toBe(200);
		expect(body.length).toBe(1);
		expect(body[0].id).toBe(createdPost.id);
		expect(body[0].title).toBe('My first post');
		expect(body[0].content).toBe('This is my first post');
		expect(body[0].status).toBe('draft');
	});
});
