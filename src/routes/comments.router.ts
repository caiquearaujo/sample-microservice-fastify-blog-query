import { FastifyInstance } from 'fastify';
import { TFnApplyToFastify } from '@/types/types';
import PostRepository from '@/repositories/PostRepository';

const getComment: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts/:id/comments/:commentId', (request, reply) => {
		const { id, commentId } = request.params as any;

		const comment = PostRepository.getComment(id, commentId);

		if (!comment) {
			return reply.status(404).send({
				status: 404,
				name: 'CommentNotFound',
				message: 'Requested comment was not found.',
			});
		}

		return reply.status(200).send(comment);
	});
};

const listComment: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts/:id/comments', (request, reply) => {
		const { id } = request.params as any;
		const { comments } = PostRepository.get(id);

		if (comments.length === 0) {
			return reply.status(404).send({
				status: 404,
				name: 'CommentsNotFound',
				message: 'No comments were found.',
			});
		}

		return reply.status(200).send(comments);
	});
};

export default { getComment, listComment };
