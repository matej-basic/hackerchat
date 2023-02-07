import express, { Request, Response } from 'express'
import 'express-async-errors';
import { json } from 'body-parser';
import http from 'http';
import fs from 'fs';
import cookieSession from 'cookie-session';
import WebSocket from 'ws';

//const privateKey = fs.readFileSync("/run/hackerchat-cert/tls.key");
//const certificate = fs.readFileSync("/run/hackerchat-cert/tls.crt");
//const credentials = {key: privateKey, cert: certificate};

interface Client {
    socket: WebSocket,
    username: User
}

interface User {
    username: String
}

interface Chat {
    firstUser: Client,
    secondUser: Client
}

const exp = express();
exp.set('trust proxy', true);
exp.use(json());
exp.use(cookieSession({
    signed: false,
    secure: true,
    httpOnly: false
}));

exp.get('/api/websocket/connect', (req: Request, res) => {
    res.status(200).send({});
})

exp.get('/api/websocket/getusers', (req, res) => {
    res.status(200).send(JSON.stringify(users));
})

const server = http.createServer(exp)

const wss = new WebSocket.Server({ server: server, clientTracking: true });

const HandleNewChat = (firstUsername: String, secondUsername: String, exportedPrivateKey: String) => {
    // Find an index in the array of clients for each username
    var firstClient: Client; // Logged in user
    var secondClient: Client; // the user with whom the logged in user wants to chat
    clients.forEach(client => {
        if (client.username.username == firstUsername) firstClient = client;
        if (client.username.username == secondUsername) secondClient = client;
    })

    NotifyUser(secondClient!, firstClient!, exportedPrivateKey)
}

const HandleChatAccept = (firstUsername: String, secondUsername: String, senderPublicKey: String) => {
    // Find an index in the array of clients for each username
    var firstClient: Client; // Logged in user
    var secondClient: Client; // the user with whom the logged in user wants to chat
    clients.forEach(client => {
        if (client.username.username == firstUsername) firstClient = client;
        if (client.username.username == secondUsername) secondClient = client;
    })

    AcceptUser(secondClient!, firstClient!, senderPublicKey);
}

const HandleChatClose = (username: String) => {
    var otherClient: Client
    chatSessions.forEach(session => {
        if (session.firstUser.username.username == username) otherClient = session.secondUser; chatSessions.splice(chatSessions.indexOf(session), 1)
        if (session.secondUser.username.username == username) otherClient = session.firstUser; chatSessions.splice(chatSessions.indexOf(session), 1)
    })

    try {
        otherClient!.socket.send("CHATEND---");
    } catch (error) { console.log("NISAM NASAO DRUGOG KLIJENTA") }
}

const NotifyUser = (userToNotify: Client, notifyingUser: Client, exportedPrivateKey: String) => {
    userToNotify.socket.send("CHATPROPOSAL---" + notifyingUser.username.username + "---" + exportedPrivateKey)
}

const AcceptUser = (userToNotify: Client, notifyingUser: Client, senderPublicKey: String) => {
    userToNotify.socket.send("CHATACCEPT---" + notifyingUser.username.username + "---" + senderPublicKey);
    chatSessions.push({ firstUser: userToNotify, secondUser: notifyingUser })
}

let clients: Array<Client> = [];
var users: Array<User> = [];
var chatSessions: Array<Chat> = []

wss.on('connection', (ws) => {
    var newConnection: Client;
    var newUser: User;
    var senderPublicKey: String;
    console.log("A client with ID " + clients.length + " has connected.");
    ws.on('message', (data) => {
        if ((/^USERNAME: /.test(data.toString()))) {
            newUser = { username: data.toString().slice(10) }
            newConnection = { socket: ws, username: newUser };
            clients.push(newConnection);
            users.push(newUser);

            clients.forEach(client => {
                client.socket.send("USERS---" + JSON.stringify(users));
            });
        } else if ((/GET USERLIST/.test(data.toString()))) {
            ws.send("USERS---" + JSON.stringify(users));
        } else if ((/^NEWCHAT;/.test(data.toString()))) {
            var chatData = data.toString().slice(8)
            var firstUsername = chatData.split("---")[0]
            var secondUsername = chatData.split("---")[1]
            var exportedPrivateKey = chatData.split("---")[2]
            console.log("exportedPrivateKey: " + exportedPrivateKey)
            HandleNewChat(firstUsername, secondUsername, exportedPrivateKey)
        } else if ((/^CHATACCEPT;/.test(data.toString()))) {
            var chatData = data.toString().slice(11)
            var firstUsername = chatData.split("---")[0]
            var secondUsername = chatData.split("---")[1].split("+")[0]
            try {
                senderPublicKey = chatData.split("+")[1].split('---')[1]
            } catch (error) { }
            console.log("senderPublicKey: " + senderPublicKey)
            HandleChatAccept(firstUsername, secondUsername, senderPublicKey)
        } else if ((/^CHATEND;/.test(data.toString()))) {
            var firstUsername = data.toString().split(";")[1]
            HandleChatClose(firstUsername)
        }
        else {
            console.log("Received a message: " + JSON.stringify(data.toString(), null, 4) + " from socket " + clients.indexOf(newConnection));

            var destinationUser: Client;
            chatSessions.forEach(session => {
                if (session.firstUser == newConnection) destinationUser = session.secondUser;
                if (session.secondUser == newConnection) destinationUser = session.firstUser;
            })

            destinationUser!.socket.send(data.toString())
            newConnection.socket.send(data.toString())
        }
    });

    ws.onopen = (event) => {
        console.log("New connection is open")
    }

    ws.onclose = (event) => {
        try {
            users.splice(users.indexOf(newConnection.username), 1)
        } catch (error) {
            console.log("ERROR: " + error)
        }

        clients.splice(clients.indexOf(newConnection), 1);
        clients.forEach(client => {
            client.socket.send("USERS---" + JSON.stringify(users));
        });

        console.log("A client with ID " + clients.length + " has disconnected.");

    }
    setInterval(() => {
        ws.ping("ping");
    }, 45000)
})

server.listen(3000);

