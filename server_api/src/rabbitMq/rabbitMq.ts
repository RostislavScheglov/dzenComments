import amqp, { MessageProperties } from 'amqplib/callback_api'

let connection: amqp.Connection | null = null // Declare a variable to hold the connection

export const sendToQueue = (queue: any, message: any) => {
  amqp.connect('amqp://localhost', (error0, conn) => {
    if (error0) {
      throw error0
    }
    connection = conn // Assign the connection to the variable

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1
      }

      channel.assertQueue(queue, {
        durable: false,
      })

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
      console.log(' [x] Sent %s', message)
    })
  })
}

export const closeConnection = () => {
  if (connection) {
    connection.close((error) => {
      if (error) {
        throw error
      }
      console.log('Connection closed')
    })
  }
}

module.exports = { sendToQueue, closeConnection }
