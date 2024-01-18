import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userSchema from '../models/User'
import { validationResult } from 'express-validator'
import { SECRET } from '../config/config'
import { Request, Response } from 'express'

export const userRegistration = async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const userExists = await userSchema.findOne({
      userEmail: req.body.userEmail,
    })
    if (userExists) {
      return res.status(500).json([
        {
          msg: 'User with this email already exists',
        },
      ])
    }

    const passwordCrypt = await bcrypt.hash(
      req.body.userPassword,
      await bcrypt.genSalt(10)
    )
    const user: any = new userSchema({
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      userPassword: passwordCrypt,
    })
    await user.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: '20d',
      }
    )
    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: 'Registration faild',
      },
    ])
  }
}

export const userLogin = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const user: any = await userSchema.findOne({
      userEmail: req.body.userEmail,
    })
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }
    const isValidPass = await bcrypt.compare(
      req.body.userPassword,
      user._doc.userPassword
    )
    if (!isValidPass) {
      return res.status(403).json([
        {
          msg: 'Invalid email or password',
        },
      ])
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: '7d',
      }
    )

    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Unable to log in',
    })
  }
}

export const getMe = async (req: any, res: Response) => {
  try {
    const user: any = await userSchema.findById(req.userId)
    if (!user) {
      return res.status(404).json([
        {
          msg: 'User not found',
        },
      ])
    }
    const { userPassword, ...userData } = user._doc

    res.json({
      ...userData,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json([
      {
        msg: 'Cant authorize user',
      },
    ])
  }
}
