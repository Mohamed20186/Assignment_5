import { Op } from 'sequelize'
import { CommentModel, UserModel, PostModel } from '../../db/models/index.js'


export const createBulkComments = async (req, res) => {
  const { comments } = req.body

  if (!Array.isArray(comments) || comments.length === 0) {
    return res.status(400).json({ message: 'comments must be a non-empty array' })
  }

  await CommentModel.bulkCreate(comments, { validate: true })

  return res.status(201).json({ message: 'comments created.' })
}


export const updateComment = async (req, res) => {
  const { commentId } = req.params
  const { userId, content } = req.body

  const comment = await CommentModel.findByPk(commentId)
  if (!comment) {
    return res.status(404).json({ message: 'comment not found.' })
  }

  if (comment.userId !== Number(userId)) {
    return res.status(403).json({ message: 'You are not authorized to update this comment.' })
  }

  await comment.update({ content })

  return res.status(200).json({ message: 'Comment updated.' })
}


export const findOrCreateComment = async (req, res) => {
  const { postId, userId, content } = req.body

  const [comment, created] = await CommentModel.findOrCreate({
    where: { postId, userId, content },
  })

  return res.status(created ? 201 : 200).json({ comment, created })
}

export const searchComments = async (req, res) => {
  const { word } = req.query
  if (typeof word !== 'string' || !word) {
    return res.status(400).json({ message: 'word query parameter is required' })
  }

  const safeWord = word.replace(/[\\%_]/g, '\\$&')

  const { count, rows } = await CommentModel.findAndCountAll({
    where: { content: { [Op.like]: `%${safeWord}%` } },
  })

  if (count === 0) {
    return res.status(404).json({ message: 'no comments found.' })
  }

  return res.status(200).json({ count, comments: rows })
}

export const getNewestComments = async (req, res) => {
  const { postId } = req.params

  const comments = await CommentModel.findAll({
    where: { postId },
    attributes: ['id', 'content', 'createdAt'],
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
    limit: 3,
  })

  return res.status(200).json(comments)
}

export const getCommentWithDetails = async (req, res) => {
  const { id } = req.params

  const comment = await CommentModel.findByPk(id, {
    attributes: ['id', 'content'],
    include: [
      { model: UserModel, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: PostModel, as: 'post', attributes: ['id', 'title', 'content'] },
    ],
  })
  if (!comment) {
    return res.status(404).json({ message: 'no comment found' })
  }

  return res.status(200).json(comment)
}
