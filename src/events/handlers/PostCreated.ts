import PostRepository, {
	IPostRecord,
} from '@/repositories/PostRepository';
import { IEventHandler } from '@/types/classes';

class PostCreated implements IEventHandler<IPostRecord> {
	protected name;

	constructor() {
		this.name = 'post.created';
	}

	public event() {
		return this.name;
	}

	public async handle(
		event: string,
		payload: Omit<IPostRecord, 'comments'>
	) {
		if (event !== this.name) return false;
		PostRepository.create(payload);
		return true;
	}
}

export default new PostCreated();
