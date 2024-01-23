import axios from '../axios/axios'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { readAndCompressImage } from 'browser-image-resizer'

const configImg = {
  quality: 1,
  maxWidth: 320,
  maxHeight: 320,
  autoRotate: true,
  debug: true,
}

export function CreateNewComment(commentId?: any) {
  const [isCreated, setIsCreated] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const createNewComment = async (params: any) => {
    try {
      const url = commentId.selectedCommentId
        ? `/comments?commentId=${commentId.selectedCommentId}`
        : '/comments'
      await axios.post(url, params)
      if (file !== null)
        // fileUpload(file).then((res) => axios.post('', res.dataUrl))
        setIsCreated(true)
    } catch (err) {
      console.log(err)
    }
  }

  const getCaptcha = async () => {
    try {
      const { data } = await axios.get('/captcha')
      console.log(data)
      return data
    } catch (err) {
      console.log(err)
    }
  }

  const fileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    await axios
      .post('/comments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files![0]
      if (file) {
        if (file.type === 'text/plain') {
          if (file.size > 100 * 1024) {
            event.target.value = ''
            return alert('Maximun file size 100kb')
          } else {
            console.log('setfile')
            return setFile(file as File)
          }
        }
        const resized = await readAndCompressImage(file, configImg)
        console.log('setfile')
        setFile(resized as File)
      }
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
      <span className="">Create a new Comment</span>
      <form onSubmit={handleSubmit(createNewComment)}>
        <input
          type="text"
          {...register('text', { required: 'Text required' })}
        />
        <input
          type="file"
          name="img"
          className="uploadImgInput"
          // ref={uploadImgRef}
          onChange={handleFileChange}
          accept=".jpeg, .png, .jpg, .svg, .txt"
        />
        {/* <div onClick={createNewComment}>Send</div> */}
        <button onClick={createNewComment}>Send</button>
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <script src="//www.google.com/recaptcha/api.js" async defer></script>
      <div class="g-recaptcha" data-sitekey="6LcgG1kpAAAAAE0vdl5fFicbW7Zdxijjzas8UE9f"></div>
    `,
          }}
        />
        <button onClick={getCaptcha}>Capcha</button>
      </form>
    </div>
  )
}
