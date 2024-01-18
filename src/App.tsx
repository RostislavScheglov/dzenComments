import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Registration } from './pages/Registration'
import { AllComments } from './pages/AllComments'
import { Login } from './pages/Login'

function App() {
  return (
    <div className="App">
      {/* <Header /> */}
      <Routes>
        <Route
          path="/"
          element={<AllComments />}
        />
        <Route
          path="/user/registration"
          element={<Registration />}
        />
        <Route
          path="/user/login"
          element={<Login />}
        />
      </Routes>
    </div>
  )
}

export default App
