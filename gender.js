function start(){

let gender = document.getElementById("gender").value

localStorage.setItem("gender",gender)

window.location = "chat.html"

}
