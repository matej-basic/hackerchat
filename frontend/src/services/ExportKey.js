async function ExportCryptoKey(keyPair) {
    const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)
    return publicKey
}

export default ExportCryptoKey;