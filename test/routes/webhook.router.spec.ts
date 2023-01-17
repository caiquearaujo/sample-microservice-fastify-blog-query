import { FastifyInstance } from 'fastify';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import routes from '@/routes';

let app: FastifyInstance;

beforeAll(async () => {
	const api = new ApiServer({
		routes: new FastifyApplierGroup(...routes),
		plugins: new FastifyApplierGroup(),
	});

	await api.bootstrap();
	app = api.app;
});

describe('Webhook Routes', () => {
	it('POST /webhook/events', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/webhook/events',
			payload: {
				event: 'any.kindofevent',
				payload: { ping: 'pong!' },
			},
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toStrictEqual({
			success: true,
			event: 'any.kindofevent',
			message: 'The event was received.',
		});
	});
});
