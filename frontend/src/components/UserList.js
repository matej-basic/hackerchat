import React, { useEffect, useState } from 'react'

const UserList = props => {
    const [renderedUsers, setRenderedUsers] = useState([]);
    const [userThatWantsToChat, setUserThatWantsToChat] = useState("");
    var useri;

    useEffect(() => {
      if (props.users != 'undefined' && props.users != null) {
        setRenderedUsers([])
        Object.values(props.users).map(user => {
          if (props.user.email != user) {
            setRenderedUsers((vals) => {
              return [...vals, user]
            })
          }
        })
      }
    }, [props.users])

    useEffect(() => {
      setUserThatWantsToChat(props.userThatWantsToChat)
    }, [props.userThatWantsToChat])

    const submitHandler = (e) => {
      props.onClickUser(e.target.innerText)
      e.target.classList.add("user-clicked")
    }

    const HandleChatProposal = (e) => {
      props.onAcceptChat(e.target.innerText)
    }

    if (renderedUsers.length > 0) {
      useri = Object.values(renderedUsers).map(user => {
        return (
          <div>
            {(userThatWantsToChat == user) ? 
            (<div className='userlist-row' value={user} onClick={(e) => HandleChatProposal(e)}>{user}+</div>) : 
            (<div className='userlist-row' value={user} onClick={(e) => submitHandler(e)}>{user}</div>) }
          </div>
          )
      })
    }

    return (
      <div className='userlist-container'>
        <div className='userlist-header'>CLICK THE USER TO START CHATTING</div>
        {useri}
      </div>
    )
}

export default UserList
