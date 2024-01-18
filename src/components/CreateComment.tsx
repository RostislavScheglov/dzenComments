import axios from '../axios/axios'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateNewComment() {
  const [isCreated, setIsCreated] = useState(false)

  const createNewComment = async (params: any) => {
    try {
      const res = await axios.post('/comment', params)
      setIsCreated(true)
    } catch (err) {
      console.log(err)
    }
  }

  const createReply = async (params: any, commentId: string) => {
    try {
      const res = await axios.patch('/comment', params)
      setIsCreated(true)
    } catch (err) {
      console.log(err)
    }
  }

  const {
    register,
    handleSubmit,
    getValues,
    resetField,
    setError,
    setValue,
    formState: { errors },
  } = useForm()
  if (isCreated) return null
  return (
    <div className="createCommentContainer">
      <h2 className="pageTitle">Create a new Comment</h2>
      <form>
        <input
          type="text"
          {...register('text', { required: 'Text required' })}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
