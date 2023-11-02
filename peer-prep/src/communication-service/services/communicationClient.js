const io = require('socket.io-client');

let audio;

let socket = io();
let rtcPeerConnection;
let remoteStream;
let localStream;

let isCaller = false;
let caller;
let receiver;
let sessionId;

const iceServers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

const streamConstraints = {
    audio: true,
    video: false,
};

const option = {
    offerToReceiveAudio: 1
}

socket.on('ready', (recv) => {
    receiver = recv;
    initPeerConnection();

    rtcPeerConnection.createOffer(option)
        .then(desc => setLocalAndOffer(desc))
        .catch(e => console.log(e));
})

socket.on('join', (session) => {
    sessionId = session;
})

socket.on('served-candidate', (event) => {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });
    rtcPeerConnection.addIceCandidate(candidate);
});

socket.on('offered', (param) => {
    caller = param.caller;
    initPeerConnection();
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(param.event));
    rtcPeerConnection.createAnswer()
        .then(desc => setLocalAndAnswer(desc))
        .catch(e => console.log(e));
});

socket.on('answered', (event) => {
    console.log(event);
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
})

const setLocalAndOffer = (sessionDescription) => {
    rtcPeerConnection.setLocalDescription(sessionDescription);
    socket.emit('offer', { 
        type: 'offer',
        sdp: sessionDescription,
        receiver: receiver
    });
}

const setLocalAndAnswer = (sessionDescription) => {
    rtcPeerConnection.setLocalDescription(sessionDescription);
    socket.emit('answer', { 
        type: 'answer',
        sdp: sessionDescription, 
        caller: caller
    });
}

const onIceCandidate = (event) => {
    let id = isCaller ? receiver : caller;
    if (event.candidate) {
        socket.emit("candidate", {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            sendTo: id
        });
    }
}

const onStream = (event) => {
    remoteStream = event.streams;
}

const addLocalStream = (event) => {
    localStream = event;
}

const initPeerConnection = () => {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onStream;
    rtcPeerConnection.addTrack(localStream);
}