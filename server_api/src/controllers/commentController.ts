import { Request, Response } from 'express'
import commentModel from '../models/Comment'
import { validationResult } from 'express-validator'
import { Document } from 'mongoose'

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentModel.find().populate({
      path: 'author',
      select: ['userName', 'userEmail', 'userImage'],
    })
    if (comments === null || comments === undefined) {
      return res.send('No comments was found')
    }
    res.status(200).send(comments)
  } catch (err) {
    res.status(400).json({
      msg: 'Cant get all comments',
    })
  }
}

export const createComment = async (req: any, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const newComment = new commentModel({
      text: req.body.text,
      author: req.userId,
    })
    if (req.query.commentId) {
      commentModel.findOneAndUpdate(
        {
          _id: req.query.commentId,
        },
        { $push: { replies: newComment } }
      )
      res.send('Reply was successfully created')
    }
    const comment = await newComment.save()
    res.send(comment)
  } catch (err) {
    console.log(err)
    res.status(400).json([
      {
        msg: 'Cant create comment',
      },
    ])
  }
}

export const updateComment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    commentModel.findOneAndUpdate(
      { _id: req.query.id },
      {
        text: req.body.text,
        $push: { likedBy: req.body.userId, replies: req.body.comment },
      },
      (err: Error, doc: Document) => {
        if (!doc) {
          return res.status(404).json([
            {
              msg: 'Cant find comment',
            },
          ])
        }
      }
    )
    res.send('Comment was successfully updated')
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant update comment',
      },
    ])
  }
}
