import routes from '@/routes';
import PostRepository, {
	ICommentRecord,
	IPostRecord,
} from '@/repositories/PostRepository';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import plugins from '@/server/plugins';

beforeAll(async () => {
	const api = new ApiServer({
		routes: new FastifyApplierGroup(...routes),
		plugins: new FastifyApplierGroup(...plugins),
	});

	await api.bootstrap();
	PostRepository.fresh();
});

describe('Post Repository', () => {
	let createdPost: IPostRecord;
	let createdComment: ICommentRecord;

	it('should get empty post', () => {
		expect(PostRepository.all().length).toBe(0);
	});

	it('can add and get a post', () => {
		const created = PostRepository.create({
			id: '1',
			title: 'My first post',
			content: 'This is my first post',
			status: 'draft',
		});

		const found = PostRepository.get(created.id);
		expect(found).toStrictEqual(created);

		createdPost = created;
	});

	it('should get recent created post', () => {
		const posts = PostRepository.all();

		expect(posts.length).toBe(1);
		expect(posts[0]).toStrictEqual(createdPost);
	});

	it('cannot get a post by invalid id', () => {
		expect(PostRepository.get('unknown')).toBeUndefined();
	});

	it('can update a post', () => {
		let updatedPost = PostRepository.update(createdPost.id, {
			title: 'My new title',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: createdPost.content,
			status: 'draft',
			comments: [],
		});

		updatedPost = PostRepository.update(createdPost.id, {
			content: 'My new content',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: 'My new content',
			status: 'draft',
			comments: [],
		});

		updatedPost = PostRepository.update(createdPost.id, {
			title: 'My updated title',
			content: 'This is my updated content, okay?',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'draft',
			comments: [],
		});

		updatedPost = PostRepository.update(createdPost.id, {
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'published',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'published',
			comments: [],
		});
	});

	it('cannot update an invalid post id', () => {
		expect(() => PostRepository.update('unknown', {})).toThrowError();
	});

	it('should get empty comments', () => {
		expect(PostRepository.all()[0].comments.length).toBe(0);
	});

	it('can add a new comment to post', () => {
		createdComment = PostRepository.addComment(createdPost.id, {
			id: '1',
			author: 'John Doe',
			content: 'This is my first comment',
			status: 'pending',
		});

		expect(createdComment).toStrictEqual({
			id: '1',
			author: 'John Doe',
			content: 'This is my first comment',
			status: 'pending',
		});

		const found = PostRepository.getComment(
			createdPost.id,
			createdComment.id
		);

		expect(found).toStrictEqual(createdComment);
	});

	it('should get recent created comments', () => {
		const comments = PostRepository.all()[0].comments;

		expect(comments.length).toBe(1);
		expect(comments[0]).toStrictEqual(createdComment);
	});

	it('cannot get a comment by invalid id', () => {
		expect(
			PostRepository.getComment(createdPost.id, 'unknown')
		).toBeUndefined();

		expect(
			PostRepository.getComment('unknown', 'unknown')
		).toBeUndefined();
	});

	it('can update a comment', () => {
		let updatedComment = PostRepository.updateComment(
			createdPost.id,
			createdComment.id,
			{
				content: 'This is my new comment',
			}
		);

		expect(updatedComment).toStrictEqual({
			id: createdComment.id,
			author: 'John Doe',
			content: 'This is my new comment',
			status: 'pending',
		});

		updatedComment = PostRepository.updateComment(
			createdPost.id,
			createdComment.id,
			{
				status: 'approved',
			}
		);

		expect(updatedComment).toStrictEqual({
			id: createdComment.id,
			author: 'John Doe',
			content: 'This is my new comment',
			status: 'approved',
		});
	});

	it('cannot update an invalid post id', () => {
		expect(() =>
			PostRepository.updateComment(createdPost.id, 'unknown', {})
		).toThrowError();
	});
});
