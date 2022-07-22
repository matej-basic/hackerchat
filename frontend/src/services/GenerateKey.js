async function GenerateCryptoKey() {
    const keyPair = await window.crypto.subtle.generateKey({
        name: "ECDH",
        namedCurve: "P-384"
    }, true, ["deriveKey"])

    return keyPair
}

export default GenerateCryptoKey