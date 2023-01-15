import { FastifyInstance } from 'fastify';
import { TFnApplyToFastify } from '@/types/types';
import EventBus from '@/events/EventBus';

const webhookToEvents: TFnApplyToFastify = async (
	app: FastifyInstance
) => {
	app.post('/webhook/events', (request, reply) => {
		const { event, payload } = request.body as any;

		console.log('Event Received', event, payload);
		EventBus.getInstance().handle(event, payload);

		reply.status(200).send({
			success: true,
			event,
			message: 'The event was received.',
		});
	});
};

export default { webhookToEvents };
