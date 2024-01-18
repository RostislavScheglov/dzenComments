import React from 'react'

export function Comment({ commentData }: any) {
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
      <button onClick={() => console.log(commentData)}>Reply</button>
      {/* {commentData.reply.map((reply: any) => {
        return (
          <div>
            <Comment commentData={reply} />
          </div>
        )
      })} */}
    </div>
  )
}
