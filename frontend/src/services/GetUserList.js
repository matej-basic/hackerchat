import GetWebSocket from "./GetWebSocket";

async function GetUserList() {
    const socket = GetWebSocket()
    var userArray;
    var usersString;
    var arrayOfUsers;
    var returnValue = []

    if (socket != null) {
        socket.onopen = function (ev) {
            socket.send("GET USERLIST")
        }
        socket.onmessage = function (ev) { 
        if (ev.data != null) {
            if ((/^USERS---/.test(ev.data.toString()))) {
                userArray = ev.data.toString().split('---')
                userArray.splice(0,1)
                userArray[0] = userArray[0].split("[")[1]
                userArray[userArray.length - 1] = userArray[userArray.length - 1].split("]")[0]
                usersString = userArray.toString()
                arrayOfUsers = usersString.split(",")
                Object.values(arrayOfUsers).map(user => {
                    var jsonUser = JSON.parse(user)
                    console.log("Adding " + jsonUser.username + " to the array")
                    returnValue.push(jsonUser.username)
                })
                console.log("returnValue: " + returnValue)
            }   
            }
        }
    }

    return returnValue
}

export default GetUserList