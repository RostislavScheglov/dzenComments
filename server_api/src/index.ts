import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
import { DBURL } from './config/config'
import commentRouter from './routes/commentRoutes'

const app = express()
const port = 4000

app.use(cors())
app.use(express.json({ limit: '5mb', type: 'application/json' }))
app.use('/user', userRouter)
app.use('/comments', commentRouter)

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
