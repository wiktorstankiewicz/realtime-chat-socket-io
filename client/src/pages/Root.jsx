import { useRef } from "react";
import { NavLink, Link, Navigate, useNavigate } from "react-router-dom";




function Root() {
  const room = useRef(null);
  const nickName = useRef(null);
    const navigate = useNavigate()
  function isActive(){
    return nickName && room && nickName.current && room.current
  }
  function joinRoom() {
    if (!nickName.current.value) {
      return;
    }
    
    navigate(`/chat`,{state:{room: room.current.value,nickName: nickName.current.value}})
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Chat application</p>
        <div>
          <span>Enter your nick</span>
          <input type="text" ref={nickName}/>
        </div>
        <div>
          <span>Room number</span>
          <input type="number" ref={room}/>
          <button
            onClick={joinRoom}
          >
            Join room
          </button>
          
        </div>
      </header>
    </div>
  );
}

const rootLoader = () => null;

export default Root;

export { rootLoader };
