import React, { useState, useEffect } from 'react';
import RandomID from '../services/RandomID';
import EncryptMessage from '../services/EncryptMessage';
import DecryptMessage from '../services/DecryptMessage';

const SendMessage = props => {
    const [messageText, setMessageText] = useState("");
    const [websocket, setWebSocket] = useState(null);

    const InitWebSocket = () => {
      useEffect(() => {
      setWebSocket(props.socket);
    }, [])};

    InitWebSocket();

    const ab2str = (bufer) => {
      return String.fromCharCode.apply(null, new Uint8Array(bufer));
    }

    const str2ab = (str) => {
      var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
  }

    const MessageHandler = async (e) => {
        e.preventDefault();
        if (messageText.length > 0) {
          const {cipherText, iv} = await EncryptMessage(messageText, props.derivedKey)
          const messageObject = {messageAuthor: props.user.email, messageText: ab2str(cipherText), messageID: RandomID(), messageIV: ab2str(iv)}
          websocket.send(JSON.stringify(messageObject, null, 0));
          setMessageText("");
      }
    }

    const HandleClick = () => {
      props.onCloseClick()
    }

  return (
    <div>
      <form className='message-form' onSubmit={MessageHandler} autoComplete="off">
          <input type="text" name="message" placeholder="Your message..." className="send-message" onChange={e => setMessageText(e.target.value)} value={messageText}></input>
      </form>
      <div onClick={e => {HandleClick()}} className='finish-chat'>CLOSE CHAT</div>
    </div>
  )
}

export default SendMessage
