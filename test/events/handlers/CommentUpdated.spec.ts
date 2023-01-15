import CommentUpdated from '@/events/handlers/CommentUpdated';
import PostRepository from '@/repositories/PostRepository';

const mockedCommentRepo = PostRepository as jest.Mocked<
	typeof PostRepository
>;

describe('Comment Created Event', () => {
	beforeEach(() => {
		PostRepository.updateComment = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	it('should has a compatible event name', () => {
		const event = CommentUpdated;
		expect(event.event()).toBe('comment.updated');
	});

	it('should not handle the incompatible event', async () => {
		const response = await CommentUpdated.handle('any.kindofevent', {
			id: 'anycommentid',
			postId: 'anypostid',
			author: 'Bruce Wayne',
			content: 'I am Batman',
			status: 'pending',
		});

		expect(response).toBeFalsy();
		expect(mockedCommentRepo.updateComment).not.toHaveBeenCalled();
	});

	it('should handle the compatible event', async () => {
		const response = await CommentUpdated.handle('comment.updated', {
			id: 'anycommentid',
			postId: 'anypostid',
			author: 'Bruce Wayne',
			content: 'I am Batman',
			status: 'pending',
		});

		expect(response).toBe(true);
		expect(mockedCommentRepo.updateComment).toHaveBeenCalledWith(
			'anypostid',
			'anycommentid',
			{
				id: 'anycommentid',
				postId: 'anypostid',
				author: 'Bruce Wayne',
				content: 'I am Batman',
				status: 'pending',
			}
		);
		expect(mockedCommentRepo.updateComment).toHaveBeenCalledTimes(1);
	});
});
