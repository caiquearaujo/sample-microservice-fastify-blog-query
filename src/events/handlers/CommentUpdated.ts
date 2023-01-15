import PostRepository, {
	ICommentRecord,
} from '@/repositories/PostRepository';
import { IEventHandler } from '@/types/classes';

class CommentUpdated
	implements IEventHandler<ICommentRecord & { postId: string }>
{
	protected name;

	constructor() {
		this.name = 'comment.updated';
	}

	public event() {
		return this.name;
	}

	public async handle(
		event: string,
		payload: ICommentRecord & { postId: string }
	) {
		if (event !== this.name) return false;
		PostRepository.updateComment(payload.postId, payload.id, payload);
		return true;
	}
}

export default new CommentUpdated();
