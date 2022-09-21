const Socket = io('/');
const videogride = document.getElementById('video-gride');
const myvideo = document.createElement('video');
myvideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
});

let myvideostream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then(stream => {
  myvideostream = stream;
  videostream(myvideo, stream);

  peer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', uservideostream => {
      addvideostream(video, uservideostream);
    })
  })

  Socket.on('user-connected', (userid) => {
    connectToNewUser(userid, stream);

  })
})


const addvideostream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loademetadata', () => {
    video.play();
  })
  videogride.append(video)
}


peer.on('open', id => {
  Socket.emit("join-room", ROOM_ID, id);
})
const connectToNewUser = (userid, stream) => {
  const call = peer.call(userid, stream)
  const video = document.createElement('video')
  call.on('stream', uservideostream => {
    addvideostream(video, uservideostream)
  })
}


const videostream = (video, stream) => {
  video.srcObject = stream;
  addEventListener('loadedmetadata', () => {
    video.play();

  })

  videogride.append(video)

}



let text = $('input')
$('html').keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    Socket.emit('message', text.val());
    text.val('');
  }
})
Socket.on('creatmessage', message => {
  console.log(message)
  $('ul').append(`<li class='message'><b>user</b><br/>${message}</li>`);
  scrollToBottom();
})


const scrollToBottom = () => {
  let d = $('.main_chat_window')
  d.scrollTop(d.prop("scrollHeight"));
}



const muteUnmute = () => {
  const enabled = myvideostream.getAudioTracks()[0].enabled;
  if (enabled) {
    myvideostream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myvideostream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
  document.querySelector('.main__mute_button').innerHTML = html;
}




const playStop = () => {
  console.log('object')
  let enabled = myvideostream.getVideoTracks()[0].enabled;
  if (enabled) {
    myvideostream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myvideostream.getVideoTracks()[0].enabled = true;
  }
}
const setStopVideo = () => {
  const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
  document.querySelector('.main__video_button').innerHTML = html;
}