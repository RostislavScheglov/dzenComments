import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
import { DBURL } from './config/config'
import commentRouter from './routes/commentRoutes'
import http from 'http'
import { Server } from 'socket.io'
import { RecaptchaV2 } from 'express-recaptcha'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 4000

app.use(cors())
app.use(express.json({ limit: '5mb', type: 'application/json' }))
const recaptcha = new RecaptchaV2(
  '6LcgG1kpAAAAAE0vdl5fFicbW7Zdxijjzas8UE9f',
  '6LcgG1kpAAAAAMdh4XVhTepTloNMnJNwcpab7Fwa'
)

io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

app.use('/user', userRouter)
app.use('/comments', commentRouter)
app.get('/captcha', recaptcha.middleware.render, (req, res) => {
  res.send(`Form with reCAPTCHA: ${res.recaptcha}`)
})
app.post('/captcha', recaptcha.middleware.verify, (req, res) => {
  if (!req.recaptcha?.error) {
    console.log('success')
    // success
  } else {
    console.log('failed')
    // failed
  }
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
mongoose
  .connect(DBURL)
  .then(() => {
    console.log('Db connected')
  })
  .catch((err) => {
    console.log('Db error: ' + err)
  })
