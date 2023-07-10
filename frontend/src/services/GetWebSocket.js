function GetWebSocket() {
    const websocket = new WebSocket('wss://hackerchat.apps.lab.okd.local:8443/api/websocket/connect');
    return websocket;
}

export default GetWebSocket;
