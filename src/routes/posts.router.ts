import { FastifyInstance } from 'fastify';
import { TFnApplyToFastify } from '@/types/types';
import PostRepository from '@/repositories/PostRepository';

const getPost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts/:id', (request, reply) => {
		const { id } = request.params as any;

		const post = PostRepository.get(id);

		if (!post) {
			return reply.status(404).send({
				status: 404,
				name: 'PostNotFound',
				message: 'Requested post was not found.',
			});
		}

		return reply.status(200).send(PostRepository.get(id));
	});
};

const listPost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts', (request, reply) => {
		const posts = PostRepository.all();

		if (posts.length === 0) {
			return reply.status(404).send({
				status: 404,
				name: 'PostsNotFound',
				message: 'No posts were found.',
			});
		}

		return reply.status(200).send(posts);
	});
};

export default { getPost, listPost };
