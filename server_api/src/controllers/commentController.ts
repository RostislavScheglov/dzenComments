import { Request, Response } from 'express'
import commentModel from '../models/Comment'
import { validationResult } from 'express-validator'
import { Document } from 'mongoose'
import AWS from 'aws-sdk'
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage() })

export const getMainComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentModel.find({ main: true }).populate([
      {
        path: 'author',
        select: ['userName', 'userEmail', 'userImage'],
      },
    ])
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
export const getOneComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentModel
      .findOne({ _id: req.params.commentId })
      .populate([
        {
          path: 'author',
          select: ['userName', 'userEmail', 'userImage'],
        },
      ])
    if (comment === null || comment === undefined) {
      return res.send('No comments was found')
    }
    res.status(200).send(comment)
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
    const { text } = req.body
    const commentId = req.query.commentId
    const idChecker = commentId !== null && commentId !== undefined
    const newComment = new commentModel({
      main: !idChecker,
      text,
      author: req.userId,
    })
    await newComment.save()
    if (idChecker) {
      const nestedComment = await commentModel.findOneAndUpdate(
        { _id: commentId },
        {
          text,
          $push: { replies: newComment._id },
        }
      )
      if (!nestedComment) {
        return res.status(404).json([
          {
            msg: 'Cant find comment',
          },
        ])
      }
      return res.status(200).send('Reply was created')
    }

    res.status(200).send(newComment)
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

export const fileUpload = async (req: Request, res: Response) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAQSY7KNKAGMRGHSI6',
      secretAccessKey: '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',
      region: 'us-east-1',
    })
    if (req.file !== undefined && req.file !== null) {
      const params = {
        Bucket: 's3fortest123',
        Key:
          Math.random().toString(36).substr(2, 15) +
          Math.random().toString(36).substr(2, 15), // File name you want to save as in S3
        Body: req.file.buffer,
      }
      s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          res.status(500).send(err)
        }
        res.status(200).send('File uploaded successfully')
      })
    }
  } catch (err) {
    res.status(400).json([
      {
        msg: 'Cant upload file',
      },
    ])
  }
}
