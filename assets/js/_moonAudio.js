// DEFINING AN ARRAY OF SCALES TO CHOOSE FROM
var scale = [
  "F3", "G3", "A3", "Bb3", "C4", "D4", "Eb4",
  "F4", "G4", "A4", "Bb4", "C5", "D5", "Eb5",
  "F5", "G5", "A5", "Bb5", "C6", "D6", "Eb6",
  "F6"
]

// SETTING UP OBJECT THAT WILL HOUSE SYNTHESIZER FOR MOON AUDIO
var synthesizers = {};


function attack(id, location) {
  // CHOOSING SCALE AT RANDOM BASED ON SCREEN POSITION
  let newIndex = Math.floor((location / window.innerWidth) * scale.length);
  let newFreq = scale[newIndex];

  // CREATING NEW SYNTH AND DEFINING ITS ID TO BE 'MOON'
  var newSynth = new Tone.DuoSynth({harmonicity: 1.5}).chain(reverb);
  newSynth[id] = id;
  newSynth.volume.value = 2;
  newSynth.triggerAttack(newFreq);

  if (!synthesizers[id]) {
    synthesizers[id] = newSynth;
    // SYNTHESIZER DOES NOT EXIST WITHIN OBJECT, CREATING IT
  } else {
    synthesizers[id].triggerRelease();
    // SYNTHESIZER EXISTS, DESTROYING SOUND. NOT DOING SO CAUSES OVERLOAD WITH MULTIPLE SOUNDS AND MY COMPUTER DOESN'T OUTPUT ANYTHING BUT CRACKLE/STATIC
  }
}

function changeFrequency(id, location, yLocation) {
  // CHOOSING A NEW SCALE BASED ON NEW POSITION FROM DRAG
  let newIndex = Math.floor((location / window.innerWidth) * scale.length);
  let newFreq = scale[newIndex]

  // GRABBING SYNTHESIZER DEFINED IN ATTACK BASED ON ID = MOON
  var newSynth = synthesizers[id];

  // SETTING NEW FREQUENCY
  newSynth.setNote(newFreq);

  // ALTERING VIBRATO BASED ON DRAG POSITION
  newSynth.vibratoAmount.value = yLocation / window.innerWidth;
}
