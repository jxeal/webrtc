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
    appendDiv(e.data);
}
dc.onopen = e => console.log("CONNECTED!!!");

rc.ondatachannel = e => {
    rc.dc = e.channel;
    rc.dc.onmessage = e => {
        console.log("Message: " + e.data);
        appendDiv(e.data);
    }
    rc.dc.onopen = e => console.log("Connection Openend!!!!!!")
}

// const texts = {
//     user,
//     text,
// }
function handleCreate() {

    lc.onicecandidate = e => {
        let SDPstring = JSON.stringify(lc.localDescription);
        console.log("Ice candidate found! Reprinting SDP " + SDPstring);
        navigator.clipboard.writeText(SDPstring);
    }

    lc.createOffer().then(e => lc.setLocalDescription(e)).then(e => console.log("Offer Set successfully!"));

}

function handleAnswer() {
    const answer = JSON.parse(document.getElementById('answer').value);
    // console.log(answer);
    lc.setRemoteDescription(answer);
}
function handleJoin() {
    const offer = JSON.parse(document.getElementById('join').value);

    // console.log(offer)

    rc.onicecandidate = e => {
        let SDPstring = JSON.stringify(rc.localDescription);
        console.log("New Ice candidate! Reprinting SDP! " + SDPstring);
        navigator.clipboard.writeText(SDPstring)
    }
    rc.setRemoteDescription(offer).then(e => console.log("Offer set!"))
    rc.createAnswer().then(a => rc.setLocalDescription(a)).then(a => console.log("Answer Created"));

}

// function handleJoin2() {
// }

function handleSend1() {
    let newText = document.getElementById('msg1').value;
    dc.send(newText)
}
function handleSend2() {
    let newText = document.getElementById('msg2').value;
    rc.dc.send(newText);
}

let d1Text = '';
let textReceived;
function appendDiv(textReceived) {
    const childElement = document.createElement('div')
    childElement.textContent = textReceived;
    document.getElementById('texts').appendChild(childElement);
}
// let d2Text = '';
// function handleClick1() {
//     let newText = document.createTextNode("  HEllo ");
//     let newText = document.getElementById('i1').value;
//     d1Text = d1Text + newText + '\n';
//     console.log(d1Text);

//     document.getElementById('d1').innerHTML = d1Text;
// }
