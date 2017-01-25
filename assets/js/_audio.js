// Global Variables for Audio
var audioContext;
var audioBuffer;
var sourceNode;
var analyserNode;
var javascriptNode;
var audioData = null;
var audioPlaying = false;
var sampleSize = 1024;  // number of samples to collect before analyzing data
var amplitudeArray; // array to hold time domain data

var audioUrl = "./assets/loops/ambient.mp3";

try {
  audioContext = new AudioContext();
} catch(e) {
  alert('Web Audio API is not supported in this browser');
}

setupAudioNodes();


javascriptNode.onaudioprocess = function () {
  analyserNode.getByteTimeDomainData(amplitudeArray);
  if (audioPlaying == true) {
    // console.log('playing');
  }
}

if(audioData == null) {
  loadSound(audioUrl);
} else {
  playSound(audioData);
}



function setupAudioNodes() {
  sourceNode     = audioContext.createBufferSource();
  analyserNode   = audioContext.createAnalyser();
  javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);

  // Create the array for the data values
  amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);

  // Now connect the nodes together
  sourceNode.connect(audioContext.destination);
  sourceNode.connect(analyserNode);
  analyserNode.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
}

// Load the audio from the URL via Ajax and store it in global variable audioData
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // When loaded, decode the data and play the sound
  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      audioData = buffer;
      playSound(audioData);
    }, onError);
  }
  request.send();
}

// Play the audio and loop until stopped
function playSound(buffer) {
  sourceNode.buffer = buffer;
  sourceNode.start(0);
  // sourceNode.loop = true;
  sourceNode.loop = false;
  audioPlaying = true;
}

function onError(e) {
  console.log(e);
}
