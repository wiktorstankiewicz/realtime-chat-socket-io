import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./chat.css";
let socket
function Chat() {
  const [ownNickName, setOwnNickName] = useState(useLocation().state.nickName);
  const [isTypingDict, setIsTypingDict] = useState({});
  const [room, setRoom] = useState(useLocation().state.room);
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    socket = io("http://localhost:8000");
    socket.on("connect", () => {
    });


    socket.emit("join-room", {
      room: room,
      nickName: ownNickName,
      time: Date.now(),
    });

    socket.on("receive-history", (history) => setMessageList(history));

    socket.on("receive-message", (message) => {
      setMessageList((prev) => [...prev, message]);
    });
    socket.on("receive-is-typing", (isTypingDict) => {
      setIsTypingDict(isTypingDict);
    });

    socket.emit("is-not-typing", ownNickName);

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

  function renderMessage(nickName, message, time, system) {
    const date = new Date(time);
    const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (!system) {
      return (
        <li className={nickName == ownNickName ? "own" : "foreign"}>
          <span>{nickName}</span>
          <span> {message}</span>
          <span>{dateString}</span>
        </li>
      );
    }
    return (
      <li className={"system"}>
        <span>{message}</span>
        <span>{dateString} </span>
      </li>
    );
  }

  return (
    <div>
      <span>
        Nickname: {ownNickName} Room: {room}
      </span>
      <ul>
        {messageList?.map(({ nickName, message, time, system }) =>
          renderMessage(nickName, message, time, system)
        )}
        {Object.entries(isTypingDict).map(([nickName, isTyping]) => {
          if (isTyping) {
            return (
              <li>
                <span>{nickName} is typing...</span>
              </li>
            );
          }
        })}
      </ul>
      <input
        type="text"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        ref={message}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={handleExit}>Exit</button>
      <button onClick={() => socket.emit("print")}>print</button>
    </div>
  );
}

const chatLoader = () => null;

export default Chat;

export { chatLoader };
