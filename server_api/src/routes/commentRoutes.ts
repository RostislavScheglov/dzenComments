import express from 'express'
import { checkAuthor, checkSession } from '../middleware/checkers'
// import { recipeValidation } from '../validators/recipesValidator.ts'
import {
  createComment,
  fileUpload,
  getMainComments,
  getOneComment,
  updateComment,
  upload,
} from '../controllers/commentController'
import { commentValidation } from '../validators/commentValidator'

const commentRouter = express.Router()

commentRouter.get('/', checkSession, getMainComments)
commentRouter.get('/:commentId', checkSession, getOneComment)
commentRouter.post('/upload', checkSession, upload.single('file'), fileUpload)

// recipesRouter.delete('/img/:id', deleteImg)

commentRouter.post('/', checkSession, commentValidation, createComment)

commentRouter.put(
  '/edit',
  checkSession,
  checkAuthor,
  commentValidation,
  updateComment
)
// commentRouter.post('/upload', uploadUrl)

// commentRouter.get('/:id', checkSession, getOne)

// recipesRouter.delete('/', checkSession, checkAuthor, remove)

// recipesRouter.patch('/like', checkSession, likeDislike)

export default commentRouter
