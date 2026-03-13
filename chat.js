const socket = io()

const chat = document.getElementById("chat")
const input = document.getElementById("msg")

socket.emit("join", localStorage.getItem("gender"))

socket.on("start", () => {
  add("✅ Connected to stranger")
})

socket.on("message", (msg) => {
  add("Stranger: " + msg)
})

socket.on("typing", () => {

  document.getElementById("status").innerText = "Stranger typing..."

  setTimeout(() => {
    document.getElementById("status").innerText = ""
  }, 1500)

})

/* FRIEND REQUEST RECEIVE */

socket.on("friendRequest", () => {

  let accept = confirm("Stranger wants to add you as friend")

  if (accept) {
    socket.emit("friendAccept")
  }

})

socket.on("friendAccepted", () => {

  add("🎉 You are now friends!")

})

input.addEventListener("input", () => {
  socket.emit("typing")
})

function send(){

  if(input.value.trim() === "") return

  socket.emit("message", input.value)

  add("You: " + input.value)

  input.value = ""

}

function addFriend(){

  socket.emit("friendRequest")

  add("📨 Friend request sent")

}

function report(){

  let reason = prompt("Enter report reason")

  if(reason){
    socket.emit("report", reason)
  }

}

function add(msg){

  let p = document.createElement("p")

  p.innerText = msg

  chat.appendChild(p)

  chat.scrollTop = chat.scrollHeight

}
