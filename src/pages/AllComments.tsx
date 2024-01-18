import axios from '../axios/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Comment } from '../components/Comment'

export function AllComments() {
  //   const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [isLoading, setLoading] = useState(true)

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
      <div className="commnetsContainer">
        {comments.map((comment: any) => {
          return (
            <div>
              <Comment commentData={comment} />
            </div>
          )
        })}
      </div>
    </>
  )
}
