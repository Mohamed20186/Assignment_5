import { UserModel } from './user.model.js'
import { PostModel } from './post.model.js'
import { CommentModel } from './comment.model.js'


UserModel.hasMany(PostModel, { foreignKey: 'userId', as: 'posts' })
PostModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' })
PostModel.hasMany(CommentModel, { foreignKey: 'postId', as: 'comments' })
CommentModel.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' })
UserModel.hasMany(CommentModel, { foreignKey: 'userId', as: 'comments' })
CommentModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' })

export { UserModel, PostModel, CommentModel }
