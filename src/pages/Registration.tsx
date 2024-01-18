import axios from '../axios/axios'
// import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import React from 'react'

export function Registration() {
  //   const [err, setErr] = useState([])
  //   const [showPass, setShowPass] = useState(false)
  //   const [img, setImg] = useState('')
  const cache = window.sessionStorage
  const fetchRegistr = async (params: any) => {
    try {
      const res = await axios.post('/user/registration', params)
      window.sessionStorage.setItem('token', res.data.token)
    } catch (err) {
      console.log(err)
      //   errorsSetter(err, setErr)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  })

  if (cache.getItem('token')) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1 className="pageTitle">Registartion</h1>
      <div className="formContainer">
        {/* <ErrorsList err={err} /> */}
        <form
          id="userDataForm"
          onSubmit={handleSubmit(fetchRegistr)}
        >
          <>Username</>
          <input
            type="text"
            {...register('userName')}
          />
          <>Email</>
          <input
            type="email"
            {...register('userEmail')}
          />
          <>Password</>
          <input
            type="passwrod"
            {...register('userPassword')}
          />
          <button type="submit">Registration</button>
        </form>
      </div>
    </div>
  )
}
