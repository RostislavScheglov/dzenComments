import { body } from 'express-validator'

export const commentValidation = [
  body('text', 'Text should be a string').isString(),
]
