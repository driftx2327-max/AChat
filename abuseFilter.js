const badWords = [
"abuse",
"badword",
"insult",
"idiot",
"stupid"
]

function checkAbuse(msg){

return badWords.some(word =>
msg.toLowerCase().includes(word)
)

}

module.exports = { checkAbuse }
