async function ImportCryptoKey(publicKey) {
    const importedKey = await window.crypto.subtle.importKey("jwk", publicKey, {
        name: "ECDH",
        namedCurve: "P-384"
    }, true, [])
    return importedKey
}

export default ImportCryptoKey;