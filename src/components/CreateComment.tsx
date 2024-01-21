import axios from '../axios/axios'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateNewComment(commentId?: any) {
  const [isCreated, setIsCreated] = useState(false)

  const createNewComment = async (params: any) => {
    try {
      const url = commentId.commentId
        ? `/comment?commentId=${commentId.commentId}`
        : '/comment'
      console.log(url)
      const res = await axios.post(url, params)
      setIsCreated(true)
    } catch (err) {
      console.log(err)
    }
  }

  // const createReply = async (params: any, commentId: string) => {
  //   try {
  //     const res = await axios.patch('/comment', params)
  //     setIsCreated(true)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

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
      <span className="">Create a new Comment</span>
      <form>
        <input
          type="text"
          {...register('text', { required: 'Text required' })}
        />
        <div onClick={createNewComment}>Send</div>
        {/* <button onClick={() => createNewComment}>Send</button> */}
      </form>
    </div>
  )
}
