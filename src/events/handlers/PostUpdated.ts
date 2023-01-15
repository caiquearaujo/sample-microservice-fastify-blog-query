import PostRepository, {
	IPostRecord,
} from '@/repositories/PostRepository';
import { IEventHandler } from '@/types/classes';

class PostUpdated implements IEventHandler<IPostRecord> {
	protected name;

	constructor() {
		this.name = 'post.updated';
	}

	public event() {
		return this.name;
	}

	public async handle(
		event: string,
		payload: Omit<IPostRecord, 'comments'>
	) {
		if (event !== this.name) return false;
		PostRepository.update(payload.id, payload);
		return true;
	}
}

export default new PostUpdated();
