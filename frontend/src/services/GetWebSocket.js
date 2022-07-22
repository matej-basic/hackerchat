function GetWebSocket() {
    const websocket = new WebSocket('wss://hackerchat.ml/api/websocket/connect');
    return websocket;
}

export default GetWebSocket;