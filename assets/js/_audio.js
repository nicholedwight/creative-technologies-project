// // Global Variables for Audio
// var audioContext;
// var audioBuffer;
// var sourceNode;
// var analyserNode;
// var javascriptNode;
// var audioData = null;
// var audioPlaying = false;
// var sampleSize = 1024;  // number of samples to collect before analyzing data
// var amplitudeArray; // array to hold time domain data
//
// var audioUrl = "./assets/loops/ambient.mp3";
//
// try {
//   audioContext = new AudioContext();
// } catch(e) {
//   alert('Web Audio API is not supported in this browser');
// }
//
// setupAudioNodes();
//
//
// javascriptNode.onaudioprocess = function () {
//   analyserNode.getByteTimeDomainData(amplitudeArray);
//   if (audioPlaying == true) {
//     // console.log('playing');
//   }
// }
//
// if(audioData == null) {
//   loadSound(audioUrl);
// } else {
//   playSound(audioData);
// }
//
//
//
// function setupAudioNodes() {
//   sourceNode     = audioContext.createBufferSource();
//   analyserNode   = audioContext.createAnalyser();
//   javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
//
//   // Create the array for the data values
//   amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
//
//   // Now connect the nodes together
//   sourceNode.connect(audioContext.destination);
//   sourceNode.connect(analyserNode);
//   analyserNode.connect(javascriptNode);
//   javascriptNode.connect(audioContext.destination);
// }
//
// // Load the audio from the URL via Ajax and store it in global variable audioData
// function loadSound(url) {
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';
//
//   // When loaded, decode the data and play the sound
//   request.onload = function () {
//     audioContext.decodeAudioData(request.response, function (buffer) {
//       audioData = buffer;
//       playSound(audioData);
//     }, onError);
//   }
//   request.send();
// }
//
// // Play the audio and loop until stopped
// function playSound(buffer) {
//   sourceNode.buffer = buffer;
//   sourceNode.start(0);
//   // sourceNode.loop = true;
//   sourceNode.loop = false;
//   console.log(sourceNode);
//   audioPlaying = true;
// }
//
// function onError(e) {
//   console.log(e);
// }
var Player = [];

Tone.Transport.bpm.value = 80;

function setupAudio() {
    Tone.Master.volume.value = -18;


    Player[0] = new Tone.Player().toMaster();
    Player[0].load("./assets/loops/ambient.mp3",function(player) {
        player.loopEnd = 3;
        player.loop = true;
        player.autostart = true;
    });
    Player[0].volume.value = 8;

    Player[1] = new Tone.Player().toMaster();
    Player[1].load("./assets/loops/drums.mp3",function(player) {
        player.loopEnd = 3;
        player.loop = true;
    });
    Player[1].volume.value = 0;

    Player[2] = new Tone.Player().toMaster();
    Player[2].load("./assets/loops/sun.mp3",function(player) {
        player.loopEnd = 3;
        player.loop = true;
    });
    Player[2].volume.value = 0;


    // Player.sync();
    Tone.Transport.start();
}
