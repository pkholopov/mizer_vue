import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import { onConnect } from './socket/onConnect.js'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/game/'
})

app.use(cors())

io.on('connection', (socket) => {
  console.log('client connected');

  onConnect(io, socket)
})

httpServer.listen(3001, () => {
  console.log('socket.io server started at http://localhost:3001/')
})


