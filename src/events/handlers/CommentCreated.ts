import PostRepository, {
	ICommentRecord,
} from '@/repositories/PostRepository';
import { IEventHandler } from '@/types/classes';

class PostCreated
	implements IEventHandler<ICommentRecord & { postId: string }>
{
	protected name;

	constructor() {
		this.name = 'comment.created';
	}

	public event() {
		return this.name;
	}

	public async handle(
		event: string,
		payload: ICommentRecord & { postId: string }
	) {
		if (event !== this.name) return false;
		PostRepository.addComment(payload.postId, payload);
		return true;
	}
}

export default new PostCreated();
