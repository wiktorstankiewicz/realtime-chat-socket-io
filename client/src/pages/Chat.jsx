import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./chat.css";
import Message from "../components/message/message";
let socket
function Chat() {
  const [ownNickName, setOwnNickName] = useState(useLocation().state.nickName);
  const [isTypingDict, setIsTypingDict] = useState({});
  const [room, setRoom] = useState(useLocation().state.room);
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();
  const messageContainer = useRef();
  function scrollToBottom() {
    setTimeout(() => 
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight
    , 100);
  }
  useEffect(() => {
    socket = io("http://localhost:8000");
    socket.on("connect", () => {
    });


    socket.emit("join-room", {
      room: room,
      nickName: ownNickName,
      time: Date.now(),
    });

    socket.on("receive-history", (history) => {
      setMessageList(history)
      scrollToBottom();
    });

    socket.on("receive-message", (message) => {
      setMessageList((prev) => [...prev, message]);
      scrollToBottom();
    });
    socket.on("receive-is-typing", (isTypingDict) => {
      setIsTypingDict(isTypingDict);
      scrollToBottom();
    });

    socket.emit("is-not-typing", ownNickName);

    document.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        sendMessage()
        scrollToBottom();
      }
    })

    window.addEventListener("beforeunload", (ev) => {
      return () => {
        
        socket.disconnect();
    }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const message = useRef();
  function sendMessage() {
    const time = Date();
    socket.emit("send-message", {
      room: room,
      nickName: ownNickName,
      message: message.current.value,
      time: time,
    });
    const currentMessage = message.current.value;
    setMessageList((prev) => [
      ...prev,
      { nickName: ownNickName, message: currentMessage, time: time },
    ]);
    message.current.value = "";
    scrollToBottom();
    }

  function handleOnFocus(e) {
    e.preventDefault();
    socket.emit("is-typing", ownNickName);
  }

  function handleOnBlur(e) {
    e.preventDefault();
    socket.emit("is-not-typing", ownNickName);
  }

  function handleExit() {
    
    socket.disconnect();
    navigate("/");
  }

  return (
    <>
    <nav>
      <div className="nav-wrapper blue">
        <a style={{"cursor": "pointer"}} onClick={handleExit} className="brand-logo center">ChatLPG</a>
      </div>
    </nav>
    <div className="container app-container">
      <div className="row">
        <h5 className="col s8">
          Logged in to room {room} as: <strong>{ownNickName}</strong>
        </h5>
        <a
            onClick={handleExit} 
            className="waves-effect waves-light btn red col s2 right"
          >
            <i className="material-icons right">exit_to_app</i>
            Exit chat
          </a>
      </div>
      <div className="chat-container">
        <div className="messages-container blue lighten-5">
          <ul ref={messageContainer}>
            {messageList?.map((message, key) =>
            <li key={key}>
              <Message {...message} ownNickName={ownNickName}/>
            </li>
            )}
            {Object.entries(isTypingDict).map(([nickName, isTyping]) => {
              if (isTyping) {
                return (
                  <li className="is-typing">
                    <span>{nickName} is typing...</span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div className="inputs-container row valign-wrapper">
          <div className="input-field col s10">
            <input 
              placeholder="Type message..." 
              id="first_name" 
              type="text" 
              className="validate"
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              ref={message} 
            />
          </div>
          <a
            onClick={sendMessage} 
            className="waves-effect waves-light btn blue col s2"
          >
            <i className="material-icons right">send</i>
            Send
          </a>
        </div>
      </div>
      {/* <button onClick={() => socket.emit("print")}>print</button> */}
    </div>
    </>
  );
}

const chatLoader = () => null;

export default Chat;

export { chatLoader };
