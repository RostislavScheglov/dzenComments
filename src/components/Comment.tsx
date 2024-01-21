import axios from '../axios/axios'
import React from 'react'

export function Comment({ commentData }: any) {
  const [replies, setReplies] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const getAllReplies = async () => {
    const fetchedReplies: any[] = []
    await Promise.all(
      commentData.replies.map(async (reply: any) => {
        try {
          const res = await axios.get(`/comments/${reply}`)
          fetchedReplies.push(res.data)
        } catch (err) {
          console.log(err)
        }
      })
    )
    setReplies(fetchedReplies)
    setIsLoading(false)
  }

  React.useEffect(() => {
    getAllReplies()
  }, [commentData])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      key={commentData._id}
      className="commentCard"
    >
      <div className="authorInfo">
        <span>{commentData.author.userName}</span>
        <span>{commentData.author.userEmail}</span>
      </div>
      <span>{commentData.text}</span>
      <button onClick={() => console.log(replies)}>Reply</button>
      <span>Replies</span>
      {replies.map((reply: any) => {
        return <Comment commentData={reply} />
      })}
    </div>
  )
}
