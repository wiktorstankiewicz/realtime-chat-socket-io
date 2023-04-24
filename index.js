const io = require("socket.io")(8000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})




const conversationHistory = {
   "8": {
     "conversation": [
       {
         "system": true,
         "time": 1682358191265,
         "message": "Wiktor has connected"
       },
       {
         "system": true,
         "time": 1682358197356,
         "message": "Michał has connected"
       },
       {
         "room": "8",
         "message": "O, tutaj możemy spokojnie porozmawiać:)",
         "nickName": "Wiktor",
         "time": "Mon Apr 24 2023 19:43:32 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "room": "8",
         "message": "Elegancko:)",
         "nickName": "Michał",
         "time": "Mon Apr 24 2023 19:43:38 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       }
     ],
     "isTypingDict": {
       "Wiktor": false,
       "Michał": false
     }
   },
   "13": {
     "conversation": [
       {
         "system": true,
         "time": 1682358071582,
         "message": "Wiktor has connected"
       },
       {
         "system": true,
         "time": 1682358074179,
         "message": "Michał has connected"
       },
       {
         "room": "13",
         "message": "Cześć Michał! Co u ciebie?",
         "nickName": "Wiktor",
         "time": "Mon Apr 24 2023 19:41:25 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "room": "13",
         "message": "Cześć! U mnie wszystko dobrze",
         "nickName": "Michał",
         "time": "Mon Apr 24 2023 19:41:35 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "system": true,
         "time": 1682358122240,
         "message": "Damian has connected"
       },
       {
         "room": "13",
         "message": "Siemanko!",
         "nickName": "Damian",
         "time": "Mon Apr 24 2023 19:42:15 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "room": "13",
         "message": "Wiktor, chodźmy na kanał 8, ten debil znowu tu przyszedł",
         "nickName": "Michał",
         "time": "Mon Apr 24 2023 19:42:38 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "room": "13",
         "message": "Spoko",
         "nickName": "Wiktor",
         "time": "Mon Apr 24 2023 19:42:46 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "system": true,
         "time": 1682358071582,
         "message": "Wiktor has disconnected"
       },
       {
         "system": true,
         "time": 1682358074179,
         "message": "Michał has disconnected"
       },
       {
         "room": "13",
         "message": ":(",
         "nickName": "Damian",
         "time": "Mon Apr 24 2023 19:42:58 GMT+0200 (czas środkowoeuropejski letni)",
         "system": false
       },
       {
         "system": true,
         "time": 1682358122240,
         "message": "Damian has disconnected"
       }
     ],
     "isTypingDict": {
       "Wiktor": false,
       "Michał": false,
       "Damian": false
     }
   }
 }





io.on("connection", socket => {
        socket.on("join-room", ({ room, nickName,time }) => {
        if (conversationHistory[room] == undefined) {
            conversationHistory[room] = { conversation: [], isTypingDict: {} }
        }
        socket.join(room)
        socket.to(room).emit("receive-message", { system: true, time:time, message: `${nickName} has connected` })
        conversationHistory[room].conversation.push({ system: true, time:time, message: `${nickName} has connected` })
        socket.emit("receive-history", conversationHistory[room].conversation)
        socket.emit("receive-is-typing", conversationHistory[room].isTypingDict)
        socket.on("send-message", ({ room, message, nickName, time }) => {
            conversationHistory[room].conversation.push({ room, message, nickName, time, system: false })
            socket.to(room).emit("receive-message", { room, message, nickName, time, system: false })
        })
        socket.on("is-typing", (nickName) => {
            conversationHistory[room].isTypingDict[nickName] = true
            socket.to(room).emit("receive-is-typing", conversationHistory[room].isTypingDict)
        })
        socket.on("is-not-typing", (nickName) => {
            conversationHistory[room].isTypingDict[nickName] = false
            socket.to(room).emit("receive-is-typing", conversationHistory[room].isTypingDict)
        })

        
        socket.on("disconnect",()=> {
            conversationHistory[room].isTypingDict[nickName] = false
            conversationHistory[room].conversation.push({ system: true, time:time, message: `${nickName} has disconnected` })
            socket.to(room).emit("receive-message", { system: true, time:time, message: `${nickName} has disconnected` })
        })

        socket.on("print", ()=>{
            console.log(JSON.stringify(conversationHistory,null,2))
        })
    }

    )
})