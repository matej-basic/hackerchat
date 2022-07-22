async function DeriveCryptoKey(publicKey, privateKey) {
    const impPub = await window.crypto.subtle.importKey("jwk", publicKey, {
        name: "ECDH",
        namedCurve: "P-384"
    }, true, [])

    const impPr = await window.crypto.subtle.importKey("jwk", privateKey, {
        name: "ECDH",
        namedCurve: "P-384"
    }, true, ["deriveKey"])

    const derivedKey = await window.crypto.subtle.deriveKey({
        name: "ECDH",
        public: impPub
    }, impPr, {
        name: "AES-GCM",
        length: 256
    }, true, ["encrypt", "decrypt"])

    return derivedKey;
}

export default DeriveCryptoKey;