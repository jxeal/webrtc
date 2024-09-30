const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Google STUN server
        { urls: 'stun:stun1.l.google.com:19302' }, // Another Google STUN server
        { urls: 'stun:stun2.l.google.com:19302' }, // Another Google STUN server
        { urls: 'stun:stun3.l.google.com:19302' }  // Another Google STUN server
    ]
};

const lc = new RTCPeerConnection(configuration);
const rc = new RTCPeerConnection(configuration);
const dc = lc.createDataChannel("channel");
dc.onmessage = e => {
    console.log("Message: " + e.data);
    const recvText = 'Received: ' + e.data;
    appendDiv(recvText);
}
dc.onopen = e => {
    console.log("CONNECTED!!!");
    connEstablished();
    connEstablishedOffer()
}

rc.ondatachannel = e => {
    rc.dc = e.channel;
    rc.dc.onmessage = e => {
        console.log("Message: " + e.data);
        const recvText = 'Received: ' + e.data;
        appendDiv(recvText);
    }
    rc.dc.onopen = e => {
        console.log("Connection Openend!!!!!!")
        connEstablished();
        connEstablishedAnswer()
    }
}

// const texts = {
//     user,
//     text,
// }
function handleCreate() {
    let SDPstring;
    lc.onicecandidate = e => {
        SDPstring = JSON.stringify(lc.localDescription);
        console.log("Ice candidate found! Reprinting SDP " + SDPstring);
        navigator.clipboard.writeText(SDPstring);
    }

    lc.createOffer().then(e => lc.setLocalDescription(e)).then(e => console.log("Offer Set successfully!"));

}

function handleAnswer() {
    const answer = JSON.parse(document.getElementById('answer').value);
    lc.setRemoteDescription(answer);
}
function handleJoin() {
    const offer = JSON.parse(document.getElementById('join').value);

    rc.onicecandidate = e => {
        let SDPstring = JSON.stringify(rc.localDescription);
        console.log("New Ice candidate! Reprinting SDP! " + SDPstring);
        navigator.clipboard.writeText(SDPstring)
    }
    rc.setRemoteDescription(offer).then(e => console.log("Offer set!"))
    rc.createAnswer().then(a => rc.setLocalDescription(a)).then(a => console.log("Answer Created"));

}


function handleSend1() {
    let newText = document.getElementById('msg1').value;
    dc.send(newText);
    newText = 'Sent: ' + newText
    appendDiv(newText);
}
function handleSend2() {
    let newText = document.getElementById('msg2').value;
    rc.dc.send(newText);
    newText = 'Sent: ' + newText
    appendDiv(newText);
}

let d1Text = '';
let textReceived;
function appendDiv(textReceived) {
    const childElement = document.createElement('div')
    childElement.textContent = textReceived;
    document.getElementById('texts').appendChild(childElement);
}

function connEstablished() {
    const container = document.getElementById('container')
    const createButton = document.getElementById('createButton');
    const sendAnswerButton = document.getElementById('sendAnswerButton');
    const answer = document.getElementById('answer');
    const join = document.getElementById('join');
    const joinButton = document.getElementById('joinButton');
    container.removeChild(createButton)
    container.removeChild(sendAnswerButton)
    container.removeChild(answer)
    container.removeChild(join)
    container.removeChild(joinButton)

    document.getElementById('connectionStatus').innerText = 'CONNECTED'

    const textcontainer = document.getElementById('textcontainer');
    textcontainer.style.display = 'block'
}

//Hide the other send button

function connEstablishedOffer() {
    const container = document.getElementById('textcontainer')
    const msgSend = document.getElementById('msgSend2');
    const msg = document.getElementById('msg2');
    container.removeChild(msgSend)
    container.removeChild(msg)
}
function connEstablishedAnswer() {
    const container = document.getElementById('textcontainer')
    const msgSend = document.getElementById('msgSend1');
    const msg = document.getElementById('msg1');
    container.removeChild(msgSend)
    container.removeChild(msg)

}
