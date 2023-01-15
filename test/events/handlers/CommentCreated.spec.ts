import CommentCreated from '@/events/handlers/CommentCreated';
import PostRepository from '@/repositories/PostRepository';

const mockedCommentRepo = PostRepository as jest.Mocked<
	typeof PostRepository
>;

describe('Comment Created Event', () => {
	beforeEach(() => {
		PostRepository.addComment = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	it('should has a compatible event name', () => {
		const event = CommentCreated;
		expect(event.event()).toBe('comment.created');
	});

	it('should not handle the incompatible event', async () => {
		const response = await CommentCreated.handle('any.kindofevent', {
			id: 'anycommentid',
			postId: 'anypostid',
			author: 'Bruce Wayne',
			content: 'I am Batman',
			status: 'pending',
		});

		expect(response).toBeFalsy();
		expect(mockedCommentRepo.addComment).not.toHaveBeenCalled();
	});

	it('should handle the compatible event', async () => {
		const response = await CommentCreated.handle('comment.created', {
			id: 'anycommentid',
			postId: 'anypostid',
			author: 'Bruce Wayne',
			content: 'I am Batman',
			status: 'pending',
		});

		expect(response).toBe(true);
		expect(mockedCommentRepo.addComment).toHaveBeenCalledWith(
			'anypostid',
			{
				id: 'anycommentid',
				postId: 'anypostid',
				author: 'Bruce Wayne',
				content: 'I am Batman',
				status: 'pending',
			}
		);
		expect(mockedCommentRepo.addComment).toHaveBeenCalledTimes(1);
	});
});
