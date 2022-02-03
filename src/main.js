const socket=io('/');
const videogrid=document.querySelector('.video-grid');
let mypeer=new Peer(undefined,{
    host:'/',
    path:'/peerjs',
    port: '443'
})
let mystream;
const myvideo=document.createElement('video');
myvideo.muted=true;
const peers={}
navigator.mediaDevices.getUseMedia({
    audio: true,
    video: true
}).then(stream=>{
    mystream=stream;
    addvideostream(myvideo,stream)
    mypeer.on('call',call=>{
        call.answer(stream)
       
        const video=document.createElement('video');
        call.on('stream',videostream=>{
            addvideostream(video,videostream)
        })
    })
})

function addvideostream(video,stream) {
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video) 
}