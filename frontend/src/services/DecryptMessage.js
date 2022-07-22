function DecodeMessage(message) {
    var dec = new TextDecoder();
    return dec.decode(message)
}

  const str2ab = (str) => {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function DecryptMessage (cipherText, iv, derivedKey) {
    //const exportedDerivedKey = await window.crypto.subtle.exportKey("jwk", derivedKey)
    //console.log(JSON.stringify(exportedDerivedKey, null, 4))
    var decryptedMessage;
    try {
        decryptedMessage = await window.crypto.subtle.decrypt({
            name: "AES-GCM",
            iv: str2ab(iv)
        }, derivedKey, str2ab(cipherText))
    } catch (error) {
        console.log("Error decrypting message: " + error)
    }

    const decodedText = DecodeMessage(decryptedMessage)
    return decodedText
}

export default DecryptMessage