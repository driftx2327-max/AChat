const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const { checkAbuse } = require("./utils/abuseFilter")
const { banUser, isBanned } = require("./utils/banSystem")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

const PORT = process.env.PORT || 3000

let maleQueue = []
let femaleQueue = []
let randomQueue = []

function connectUsers(a, b) {

  a.partner = b
  b.partner = a

  a.emit("start")
  b.emit("start")

}

io.on("connection", (socket) => {

  const ip = socket.handshake.address

  if (isBanned(ip)) {
    socket.emit("banned")
    socket.disconnect()
    return
  }

  socket.on("join", (gender) => {

    if (gender === "male") {

      if (femaleQueue.length > 0) {

        let partner = femaleQueue.shift()
        connectUsers(socket, partner)

      } else {

        maleQueue.push(socket)

      }

    }

    else if (gender === "female") {

      if (maleQueue.length > 0) {

        let partner = maleQueue.shift()
        connectUsers(socket, partner)

      } else {

        femaleQueue.push(socket)

      }

    }

    else {

      randomQueue.push(socket)

      if (randomQueue.length >= 2) {

        let a = randomQueue.shift()
        let b = randomQueue.shift()

        connectUsers(a, b)

      }

    }

  })

  socket.on("message", (msg) => {

    if (checkAbuse(msg)) {

      banUser(ip)

      socket.emit("banned")

      socket.disconnect()

      return

    }

    if (socket.partner) {

      socket.partner.emit("message", msg)

    }

  })

  socket.on("typing", () => {

    if (socket.partner) {

      socket.partner.emit("typing")

    }

  })

  socket.on("friendRequest", () => {

    if (socket.partner) {

      socket.partner.emit("friendRequest")

    }

  })

  socket.on("friendAccept", () => {

    if (socket.partner) {

      socket.partner.emit("friendAccepted")

    }

  })

  socket.on("report", (reason) => {

    console.log("Report:", reason)

  })

  socket.on("disconnect", () => {

    if (socket.partner) {

      socket.partner.emit("message", "Stranger disconnected")

      socket.partner.partner = null

    }

  })

})

server.listen(PORT, () => {

  console.log("AChats running on port " + PORT)

})
