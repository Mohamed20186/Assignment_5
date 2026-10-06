import { fn, col } from 'sequelize'
import { PostModel, UserModel, CommentModel } from '../../db/models/index.js'

export const createPost = async (req, res) => {
  const { title, content, userId } = req.body

  const post = new PostModel({ title, content, userId })
  await post.save()

  return res.status(201).json({ message: 'Post created successfully.' })
}


export const deletePost = async (req, res) => {
  const { postId } = req.params
  const userId = req.body.userId ?? req.query.userId

  const post = await PostModel.findByPk(postId)
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' })
  }

  if (post.userId !== Number(userId)) {
    return res.status(403).json({ message: 'You are not authorized to delete this post.' })
  }

  await post.destroy()

  return res.status(200).json({ message: 'Post deleted.' })
}

export const getPostsWithDetails = async (req, res) => {
  const posts = await PostModel.findAll({
    attributes: ['id', 'title'],
    include: [
      { model: UserModel, as: 'user', attributes: ['id', 'name'] },
      { model: CommentModel, as: 'comments', attributes: ['id', 'content'] },
    ],
  })

  return res.status(200).json(posts)
}

export const getPostsWithCommentCount = async (req, res) => {
  const posts = await PostModel.findAll({
    attributes: ['id', 'title', [fn('COUNT', col('comments.id')), 'commentCount']],
    include: [{ model: CommentModel, as: 'comments', attributes: [] }], // join only, no comment columns
    group: ['Post.id'],
    raw: true,
  })

  const result = posts.map((post) => ({ ...post, commentCount: Number(post.commentCount) }))

  return res.status(200).json(result)
}
