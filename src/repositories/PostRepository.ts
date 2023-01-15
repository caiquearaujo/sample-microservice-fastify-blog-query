import ApplicationError from '@/exceptions/ApplicationError';

export type TCommentStatus = 'pending' | 'recused' | 'approved';

export interface ICommentRecord {
	id: string;
	author: string;
	content: string;
	status: TCommentStatus;
}

export type TPostStatus = 'draft' | 'published' | 'archived';

export interface IPostRecord {
	id: string;
	title: string;
	content: string;
	status: TPostStatus;
	comments: ICommentRecord[];
}

let globalPosts: Record<string, IPostRecord> = {};

export default class PostRepository {
	static get(id: string) {
		return globalPosts[id] ?? undefined;
	}

	static getComment(postId: string, commentId: string) {
		return globalPosts[postId]?.comments.find(
			comment => comment.id === commentId
		);
	}

	static create(post: Omit<IPostRecord, 'comments'>) {
		const createdPost = { ...post, comments: [] };

		globalPosts[createdPost.id] = createdPost;
		return createdPost;
	}

	static update(
		id: string,
		post: Partial<Omit<IPostRecord, 'id' | 'comments'>>
	) {
		const found = PostRepository.get(id);

		if (!found) {
			throw new ApplicationError(
				500,
				'CannotUpdatePost',
				'Post does not exist to be updated.'
			);
		}

		const updatedPost = {
			...found,
			...post,
		};

		globalPosts[id] = updatedPost;
		return updatedPost;
	}

	static addComment(postId: string, comment: ICommentRecord) {
		const found = PostRepository.get(postId);

		if (!found) {
			throw new ApplicationError(
				500,
				'CannotAddComment',
				'Post does not exist to add comment.'
			);
		}

		const createComment: ICommentRecord = {
			...comment,
		};

		found.comments.push(createComment);
		globalPosts[postId] = found;
		return createComment;
	}

	static updateComment(
		postId: string,
		commentId: string,
		comment: Partial<Omit<ICommentRecord, 'id' | 'author'>>
	) {
		const found = PostRepository.getComment(postId, commentId);

		if (!found) {
			throw new ApplicationError(
				500,
				'CannotUpdateComment',
				'Comment does not exist to be updated.'
			);
		}

		const updatedComment = {
			...found,
			content: comment.content ?? found.content,
			status: comment.status ?? found.status,
		};

		globalPosts[postId].comments.forEach((currentComment, idx) => {
			if (currentComment.id !== updatedComment.id) {
				return;
			}

			globalPosts[postId].comments[idx] = updatedComment;
		});

		return updatedComment;
	}

	static all() {
		return Object.values(globalPosts);
	}

	static fresh() {
		globalPosts = {};
	}
}
