const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const userRoute = require('./routes/userRoute')
const chatRouter = require('./routes/chatRoutes')
const messageRouter = require('./routes/messages')
const PORT = process.env.PORT || 5000
const path = require('path')
//mongoose connection
mongoose.connect(process.env.DBURL)
mongoose.connection
    .on('open', () => console.log("Dtabase Connected SuccesFully"))
    .on('error', (error) => console.log("MongooseError:::", error))
//middle ware for back end
app.use(express.json())
app.use(cors())
app.use('/api/user', userRoute)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
// //-------------------dEPLOY
// const __dirname1 = path.resolve()
// if (process.env.NODE_ENV == "PRODUCTION") {
//     app.use(express.static(path.join(__dirname1, '/frontend/build')))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
//     })
// } else {
//     app.get('/', (req, res) => {
//         res.send("App Is Run On Port 5000")
//     })

// }

///----------DEPLOY

//server setUp
const server = app.listen(PORT, () => console.log("Server Listen To Port", PORT))
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

//connect socket

io.on("connection", (socket) => {
    console.log("Connected To Socket", socket.id);

    socket.on("set-up", (user) => {
        socket.join(user._id);
        console.log("create Room", user._id);
        socket.emit("connected")
    })
    socket.on('join-chat', (room) => {
        if (room !== null) {
            socket.join(room)
            console.log("Join Room for", room);
        }
    })

    socket.on('send-message', (newMessage) => {
        const chat = newMessage.ChatId._id
        if (chat) {
            console.log("chatId", chat);
            socket.to(chat).emit("recieve-message", newMessage)
        }
    })

    socket.on('typing', (room) => {
        if (room !== null) {
            socket.to(room).emit('typing', room)
        }
    })

    socket.on('stop-typing', (room) => {
        if (room !== null) {
            socket.to(room).emit('stop-typing')
        }
    })

    //disconnect from socket
    socket.on("disconnect", () => {
        //console.log("disconnected From Socket", socket.id);
    })

})