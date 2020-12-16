import socket from '@utils/socket';
import Peer from 'peerjs';

let myPeer = null;
let peerID = null;

const videoGrid = document.getElementById('video-grid');

const peers = {};

function addVideoStream(mediaConnection) {
  const video = document.createElement('video');

  mediaConnection.on('stream', (stream) => {
    // eslint-disable-next-line no-param-reassign
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.append(video);
  });

  mediaConnection.on('close', () => {
    video.remove();
  });
}

// socket을 통해 다른 사람이 접속한걸 받았을 때
// 다른 사람에게 mediaConnection 요청을 보냄
function connectToNewUser(userId, stream) {
  const mediaConnection = myPeer.call(userId, stream);
  addVideoStream(mediaConnection);

  peers[userId] = mediaConnection;
}

// 내가 다른 사람의 mediaConnection 요청을 받았을 때
function setAnswerBehavior(stream) {
  myPeer.on('call', (mediaConnection) => {
    // 다른 사람의 요청에 answer를 날림
    mediaConnection.answer(stream);
    addVideoStream(mediaConnection);
  });

  socket.on('another voice connected', (userId) => {
    connectToNewUser(userId, stream);
  });
}

const getAudioStream = () =>
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });

function activateVoiceChat() {
  myPeer = new Peer();
  myPeer.on('open', async (id) => {
    peerID = id;
    try {
      const stream = await getAudioStream();
      setAnswerBehavior(stream);
    } catch (err) {
      console.log('Get Media error: ', err);
    }

    socket.emit('player connect voice', id);
  });
}

function deactivateVoiceChat() {
  socket.emit('player disconnect voice', { id: peerID });
  myPeer.destroy();
}

socket.on('voice disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

export { activateVoiceChat, deactivateVoiceChat };
