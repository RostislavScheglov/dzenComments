import axios from '../axios/axios'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

export function Login() {
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const setTokenLocal = (data: any) => {
    if ('token' in data) {
      window.sessionStorage.setItem('token', data.token)
    }
  }

  const fetchLogin = (params: any) => {
    axios
      .post('/user/login', params)
      .then((res) => {
        setTokenLocal(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  if (window.sessionStorage.getItem('token')) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <div className="formContainer">
        <h1 className="pageTitle">Login</h1>
        {/* <ErrorsList
          err={err}
          isLoading={isLoading}
        /> */}
        <form
          id="userDataForm"
          onSubmit={handleSubmit(fetchLogin)}
        >
          <input
            type="email"
            {...register('userEmail')}
          ></input>
          <input
            type="password"
            {...register('userPassword')}
          ></input>
          <button
            className="submitBtn"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
