import axios from 'axios';

import { EVENT_URL, HOST, PORT } from '@/env/config';
import Logger from '@/utils/Logger';
import { IEventHandler } from '@/types/classes';

export default class EventBus {
	private static instance: EventBus;

	protected events: Array<IEventHandler<object>> = [];

	private constructor(events: Array<IEventHandler<object>>) {
		this.events = events;
	}

	public static prepareInstance(events: Array<IEventHandler<object>>) {
		EventBus.instance = new EventBus(events);
		return EventBus.instance;
	}

	public static getInstance() {
		return EventBus.instance;
	}

	public static async emit(
		event: string,
		payload: object
	): Promise<boolean> {
		try {
			const { data } = await axios.post(`${EVENT_URL}/emit`, {
				event,
				payload,
			});
			return data.status === 'OK';
		} catch (err) {
			Logger.getInstance().logger.error(err);
			return false;
		}
	}

	public static async subscribe(events: string[]): Promise<boolean> {
		try {
			const { data } = await axios.post(`${EVENT_URL}/subscribe`, {
				webhook: `http://${HOST}:${PORT}/webhook/events`,
				events,
			});

			return data.status === 'OK';
		} catch (err) {
			Logger.getInstance().logger.error(err);
			return false;
		}
	}

	public static async uncaught(events: string[]): Promise<boolean> {
		try {
			const { data } = await axios.post<
				Array<{
					event: string;
					payload: object;
				}>
			>(`${EVENT_URL}/uncaught`, {
				webhook: `http://${HOST}:${PORT}/webhook/events`,
				events,
			});

			await Promise.all(
				data.map(async ({ event, payload }) => {
					console.log('Uncaught Event on Startup', event, payload);
					await EventBus.getInstance().handle(event, payload);
				})
			);

			return true;
		} catch (err) {
			Logger.getInstance().logger.error(err);
			return false;
		}
	}

	public async handle(event: string, payload: object): Promise<void> {
		await Promise.all(
			this.events.map(async e => {
				await e.handle(event, payload);
			})
		);
	}
}
