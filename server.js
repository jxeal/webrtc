
const configuration = {
    iceServers: [
        // { urls: 'stun:stun.l.google.com:19302' }, // Google STUN server
        // { urls: 'stun:stun1.l.google.com:19302' }, // Another Google STUN server
        // { urls: 'stun:stun2.l.google.com:19302' }, // Another Google STUN server
        // { urls: 'stun:stun3.l.google.com:19302' },  // Another Google STUN server
        {
            "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
            "credential": "tE2DajzSJwnsSbc123",
            "urls": "turn:global.turn.twilio.com:443?transport=tcp"
        }
    ]
};

const pc = new RTCPeerConnection(configuration);
let localStream = null;
let remoteStream = null;

let videoCameraFlag = 0;
async function playVideoFromCamera() {
    if (videoCameraFlag === 1) {
        const videoTracks = localStream.getVideoTracks();
        if (videoTracks.length > 0) {
            videoTracks[0].enabled = true; // Enable the track
        }
        return; // Exit the function
    }
    try {
        const constraints = {
            'video':
            // true,
            {
                'height': 384,
                'width': 512,
            },
            'audio': true
        }
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        remoteStream = new MediaStream();
        const videoElementLocal = document.querySelector('video#localVideo');
        const videoElementRemote = document.querySelector('video#remoteVideo');
        videoElementLocal.srcObject = localStream;
        videoElementRemote.srcObject = remoteStream;
        videoElementLocal.controls = false;
        videoElementRemote.controls = false;
        videoCameraFlag = 1;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
            remoteStream.addTrack(event.track);
            const remoteVideo = document.querySelector('video#remoteVideo');
            remoteVideo.srcObject = remoteStream;
        };
    } catch (e) {
        console.error('Error opening camera. ', e);
    }
}

function toggleVideoFromCamera() {
    // const videoElement = document.querySelector('video#localVideo');
    // videoElement.srcObject.getTracks().forEach(tracks => tracks.stop());
    // videoElement.srcObject = null;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled; // Disable the track instead of stopping it
    }
    videoCameraFlag = 0;
}

function handleCameraClick() {
    if (videoCameraFlag) toggleVideoFromCamera();
    else playVideoFromCamera();
}

//Flag for create offer and handle the create offer button click

let offerFlag = 0;
function handleOfferClick() {
    if (!offerFlag) {
        handleCreate();
        offerFlag = 1;
    } else {
        handleAnswer();
        offerFlag = 0;
    }
}

//Create offer 

function handleCreate() {
    let SDPstring;
    pc.onicecandidate = e => {
        SDPstring = JSON.stringify(pc.localDescription);
        console.log("Ice candidate found! Reprinting SDP " + SDPstring);
        navigator.clipboard.writeText(SDPstring);
    }

    pc.createOffer().then(e => pc.setLocalDescription(e)).then(e => console.log("Offer Set successfully!"));
}

// Accept the answer SDP from peer 2

function handleAnswer() {
    const answer = JSON.parse(document.getElementById('answer').value);
    pc.setRemoteDescription(answer);
}

// Accept offer SDP and send answer SDP

function handleJoin() {
    const offer = JSON.parse(document.getElementById('join').value);

    pc.onicecandidate = e => {
        let SDPstring = JSON.stringify(pc.localDescription);
        console.log("New Ice candidate! Reprinting SDP! " + SDPstring);
        navigator.clipboard.writeText(SDPstring)
    }
    pc.setRemoteDescription(offer).then(e => console.log("Offer set!"))
    pc.createAnswer().then(a => pc.setLocalDescription(a)).then(a => console.log("Answer Created"));
}

