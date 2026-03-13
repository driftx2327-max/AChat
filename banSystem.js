let bannedUsers = {}

function banUser(ip){

bannedUsers[ip] = Date.now() + (30 * 60 * 1000)

}

function isBanned(ip){

if(!bannedUsers[ip]) return false

return Date.now() < bannedUsers[ip]

}

module.exports = { banUser, isBanned }
