import PostUpdated from '@/events/handlers/PostUpdated';
import PostRepository from '@/repositories/PostRepository';

const mockedCommentRepo = PostRepository as jest.Mocked<
	typeof PostRepository
>;

describe('Post Updated Event', () => {
	beforeEach(() => {
		PostRepository.update = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	it('should has a compatible event name', () => {
		const event = PostUpdated;
		expect(event.event()).toBe('post.updated');
	});

	it('should not handle the incompatible event', async () => {
		const response = await PostUpdated.handle('any.kindofevent', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});

		expect(response).toBeFalsy();
		expect(mockedCommentRepo.update).not.toHaveBeenCalled();
	});

	it('should handle the compatible event', async () => {
		const response = await PostUpdated.handle('post.updated', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});

		expect(response).toBe(true);
		expect(mockedCommentRepo.update).toHaveBeenCalledWith('anyid', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});
		expect(mockedCommentRepo.update).toHaveBeenCalledTimes(1);
	});
});
