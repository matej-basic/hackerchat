import React, { useState, useEffect } from 'react'
import GetWebSocket from '../services/GetWebSocket';
import ChatBox from './ChatBox'
import SendMessage from './SendMessage'
import UserList from './UserList';
import ExportCryptoKey from '../services/ExportKey';
import DeriveCryptoKey from '../services/DeriveKey';
import ImportCryptoKey from '../services/ImportKey';

const ChatView = props => {
      const [websocket, setWebSocket] = useState(null);
      const [userList, setUserList] = useState([]);
      const [userChat, setUserChat] = useState("");
      const [userThatWantsToChat, setUserThatWantsToChat] = useState("");
      const [importedKey, setImportedKey] = useState(null) // Public key of the other client
      const [derivedKey, setDerivedKey] = useState(null) // Derived key that should be the same on both sides
      const [exportedPrivateKey, setExportedPrivateKey] = useState(null) // Exported my own public key
      const [myRsaKeyPair, setMyRsaKeyPair] = useState(null)

      var senderPublicKey;

      useEffect(() => {
          props.onGetSocket(GetWebSocket())
      }, [])

      useEffect(() => {
        setMyRsaKeyPair(props.rsaKey)
        console.log("myRsaKeyPair is set")
      }, [])

      useEffect(() => {
        setWebSocket(props.socket)
      }, [props.socket])

      useEffect(() => {
        const fetchExportedKey = async () => {
          setExportedPrivateKey(await window.crypto.subtle.exportKey("jwk", myRsaKeyPair.publicKey))
        }

        fetchExportedKey().catch(err => { console.log("Error exporting private key") })
      }, [])

      const ProposeChat = async (value) => {
        websocket.send("NEWCHAT;" + props.user.email + "---" + value + "---" + JSON.stringify(await window.crypto.subtle.exportKey("jwk", myRsaKeyPair.publicKey)));
      }

      const HandleChatProposal = async (value, exportedKey) => {
        setUserThatWantsToChat(value);
        //const senderPublicKey = await ImportCryptoKey(JSON.parse(exportedKey))
        const senderPublicNotImported = JSON.parse(exportedKey)
        senderPublicKey = JSON.parse(exportedKey)
        setImportedKey(senderPublicKey)
      }

      const HandleChatAccept = async (value, pubKey) => {
        if (pubKey != null) {
          const returnedImportedKey = await ImportCryptoKey(JSON.parse(pubKey))
          setImportedKey(returnedImportedKey)
          const returnedDerivedKey = await DeriveCryptoKey(JSON.parse(pubKey), await window.crypto.subtle.exportKey("jwk", myRsaKeyPair.privateKey))
          setDerivedKey(returnedDerivedKey)
          setUserChat(value)
        } else { 
          websocket.send("CHATACCEPT;" + props.user.email + "---" + value + "---" + JSON.stringify(await window.crypto.subtle.exportKey("jwk", myRsaKeyPair.publicKey)))
          const returnedDerivedKey = await DeriveCryptoKey(importedKey, await window.crypto.subtle.exportKey("jwk", myRsaKeyPair.privateKey))
          setDerivedKey(returnedDerivedKey)
          setUserChat(value)
        }
      }

      const HandleChatClose = () => {
        setUserChat("")
        setUserThatWantsToChat("")
        websocket.send("CHATEND;" + props.user.email)
      }

      if (websocket != null) {
          return (
            <div>
            {(userChat == "") ? (
              <>
              <UserList onChatEnd={value => {setUserChat("")}} onAcceptChat={value => { HandleChatAccept(value, null) }} onClickUser={value => { ProposeChat(value); } } user={props.user} users={userList} userThatWantsToChat={userThatWantsToChat} />
              <ChatBox socket={websocket} user={props.user} onUserListChange={value => setUserList(value)} onUserChatProposal={(value, exportedKey) => { HandleChatProposal(value, exportedKey)}}  onUserChatAccept={(value, pubKey) => HandleChatAccept(value, pubKey)}/>
              </>
            ) : (
              <>
              <ChatBox onChatEnd={value => {HandleChatClose()}} socket={websocket} user={props.user} onUserListChange={value => setUserList(value)} derivedKey={derivedKey}/>
              <SendMessage onCloseClick={() => {HandleChatClose()}} socket={websocket} user={props.user} derivedKey={derivedKey}/>
              </>
            )}
            </div>
          )
      }
}

export default ChatView
