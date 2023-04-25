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
    <nav>
      <div className="nav-wrapper blue">
        <a className="brand-logo center">Super chat</a>
      </div>
    </nav>
      <div className="container app-container">
        <div className="row">
          <div className="input-field col s6">
            <input id="nickname" type="text" className="validate" ref={nickName} />
            <label for="nickname">Enter your nickname</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <input id="room" type="number" className="validate" ref={room} />
            <label for="room">Enter room number</label>
          </div>
        </div>
        <div className="row">
          <a onClick={joinRoom} className="waves-effect waves-light btn blue">
            <i className="material-icons left">group_add</i>
            Join channel
          </a>
        </div>
          
      </div>
    </div>
  );
}

const rootLoader = () => null;

export default Root;

export { rootLoader };
