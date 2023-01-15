import PostCreated from '@/events/handlers/PostCreated';
import PostRepository from '@/repositories/PostRepository';

const mockedCommentRepo = PostRepository as jest.Mocked<
	typeof PostRepository
>;

describe('Post Created Event', () => {
	beforeEach(() => {
		PostRepository.create = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	it('should has a compatible event name', () => {
		const event = PostCreated;
		expect(event.event()).toBe('post.created');
	});

	it('should not handle the incompatible event', async () => {
		const response = await PostCreated.handle('any.kindofevent', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});

		expect(response).toBeFalsy();
		expect(mockedCommentRepo.create).not.toHaveBeenCalled();
	});

	it('should handle the compatible event', async () => {
		const response = await PostCreated.handle('post.created', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});

		expect(response).toBe(true);
		expect(mockedCommentRepo.create).toHaveBeenCalledWith({
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});
		expect(mockedCommentRepo.create).toHaveBeenCalledTimes(1);
	});
});
