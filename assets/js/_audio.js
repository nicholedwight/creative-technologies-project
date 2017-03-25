// CREATING AN ARRAY FOR THE PLAYER LOOPS TO EASILY ACCESS IN THE MOUSE DOWN OR MOVE FUNCTIONS IN _MAIN.JS
var Player = [];

Tone.Transport.bpm.value = 80;

function setupAudio() {
  console.log('audio butts');
    Tone.Master.volume.value = -10;

    // THESE ARE THE TWO LOOPS THAT ARE USED, 0 IS USED ON THE ASTEROID AND 1 IS USED ON THE CLOUDS. BOTH SOURCED FROM LOOPERMAN.COM
    //https://www.looperman.com/loops/detail/103304/space-pad-by-gmsp-free-120bpm-electronic-pad-loop
    Player[0] = new Tone.Player().toMaster();
    Player[0].load("./assets/loops/space.wav",function(player) {
        player.loopEnd = 16;
        player.loop = true;
    });
    Player[0].volume.value = 8;

    Player[1] = new Tone.Player().toMaster();
    Player[1].load("./assets/loops/drums.mp3",function(player) {
        player.loopEnd = 3;
        player.loop = true;
    });
    Player[1].volume.value = 0;

    Tone.Transport.start();
}
