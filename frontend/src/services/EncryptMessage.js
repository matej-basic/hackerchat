function EncodeMessage(message) {
    var enc = new TextEncoder();
    return enc.encode(message);
}

async function EncryptMessage(message, derivedKey) {
    var encodedMessage = EncodeMessage(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cipherText = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: iv
    }, derivedKey, encodedMessage)

    return {cipherText, iv}
}

export default EncryptMessage;