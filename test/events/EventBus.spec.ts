import { EVENT_URL, HOST, PORT } from '@/env/config';
import EventBus from '@/events/EventBus';
import AnyKinfOfEventHandler from '@test/__mocks__/AnyKindOfEventHandler';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Event Emitter', () => {
	afterEach(jest.clearAllMocks);

	it('can emit an event', async () => {
		mockedAxios.post.mockResolvedValue({ data: { status: 'OK' } });
		const result = await EventBus.emit('any.kindofevent', {
			ping: 'pong!',
		});

		expect(mockedAxios.post).toHaveBeenCalledWith(`${EVENT_URL}/emit`, {
			event: 'any.kindofevent',
			payload: { ping: 'pong!' },
		});

		expect(mockedAxios.post).toHaveBeenCalledTimes(1);
		expect(result).toBe(true);
	});

	it('cannot emit an event', async () => {
		mockedAxios.post.mockResolvedValue({
			data: { status: 'Unknown event' },
		});
		const result = await EventBus.emit('any.kindofevent', {
			ping: 'pong!',
		});

		expect(mockedAxios.post).toHaveBeenCalledWith(`${EVENT_URL}/emit`, {
			event: 'any.kindofevent',
			payload: { ping: 'pong!' },
		});

		expect(mockedAxios.post).toHaveBeenCalledTimes(1);
		expect(result).toBe(false);
	});

	it('can subscribe to an event', async () => {
		mockedAxios.post.mockResolvedValue({ data: { status: 'OK' } });
		const result = await EventBus.subscribe(['any.kindofevent']);

		expect(mockedAxios.post).toHaveBeenCalledWith(
			`${EVENT_URL}/subscribe`,
			{
				webhook: `http://${HOST}:${PORT}/webhook/events`,
				events: ['any.kindofevent'],
			}
		);

		expect(mockedAxios.post).toHaveBeenCalledTimes(1);
		expect(result).toBe(true);
	});

	it('cannot subscribe to an event', async () => {
		mockedAxios.post.mockResolvedValue({
			data: { status: 'Invalid webhook' },
		});
		const result = await EventBus.subscribe(['any.kindofevent']);

		expect(mockedAxios.post).toHaveBeenCalledWith(
			`${EVENT_URL}/subscribe`,
			{
				webhook: `http://${HOST}:${PORT}/webhook/events`,
				events: ['any.kindofevent'],
			}
		);

		expect(mockedAxios.post).toHaveBeenCalledTimes(1);
		expect(result).toBe(false);
	});

	it('can handle an event', async () => {
		const handler = new AnyKinfOfEventHandler();
		EventBus.prepareInstance([handler]);

		await EventBus.getInstance().handle('any.kindofevent', {});

		expect(handler.event).toHaveBeenCalled();
		expect(handler.handle).toHaveBeenCalledWith('any.kindofevent', {});
		expect(handler.compatible).toHaveBeenCalled();
		expect(handler.incompatible).not.toHaveBeenCalled();
	});

	it('cannot handle an event', async () => {
		const handler = new AnyKinfOfEventHandler();
		EventBus.prepareInstance([handler]);

		await EventBus.getInstance().handle('another.kindofevent', {});

		expect(handler.event).toHaveBeenCalled();
		expect(handler.handle).toHaveBeenCalledWith(
			'another.kindofevent',
			{}
		);

		expect(handler.compatible).not.toHaveBeenCalled();
		expect(handler.incompatible).toHaveBeenCalled();
	});
});
