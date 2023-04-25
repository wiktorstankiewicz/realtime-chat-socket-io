function Message({nickName, message, time, system, ownNickName}) {
    const date = new Date(time);
    const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return (
        <>
            {system ?
                <div className={"message system"}>
                    <p className="message-body">{message}</p>
                    <p className="time">{dateString} </p>
                </div> : 
                <div className={`message ${nickName === ownNickName ? "own" : "foreign"}`}>
                    <p className="nickname">{nickName}</p>
                    <p className="message-body"> {message}</p>
                    <p className="time">{dateString}</p>
                </div>
            }
        </>
    )
}

export default Message