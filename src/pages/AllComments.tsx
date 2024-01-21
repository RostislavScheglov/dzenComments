import axios from '../axios/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Comment } from '../components/Comment'
import { CreateNewComment } from '../components/CreateComment'

export function AllComments() {
  //   const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isCreateComment, setIsCreateComment] = useState(false)

  const fetchAllComments = async () => {
    try {
      const { data } = await axios.get('/comments')
      setComments(data)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllComments()
  }, [])

  if (comments.length === 0) {
    return (
      <div className="noCommentsContainer">
        <h2>No Comments yet</h2>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="noCommentsContainer">
        <h2>Loading...</h2>
      </div>
    )
  }
  return (
    <>
      <h1 className="pageTitle">All Comments</h1>
      <button onClick={() => setIsCreateComment(!isCreateComment)}>
        Create new Comment
      </button>
      {isCreateComment ? <CreateNewComment /> : null}
      <div className="commnetsContainer">
        {comments.map((comment: any) => {
          return <Comment commentData={comment} />
        })}
      </div>
    </>
  )
}
