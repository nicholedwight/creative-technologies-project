SliderFunctions = [

    function(v,t) {
      console.log('hitting sliderfunction 0');
        Player[1].volume.rampTo(v,t); // 0
    },
    function(v,t,g) {
        Filter[0].frequency.rampTo(v,t); // 1
        if (g) {
            var colVal = (v/240) - 50;
            masterCol.R = colVal + (v/600);
            masterCol.G = colVal-10;
            masterCol.B = (v/480) - 50;
        }
    },
    function(v,t,g) {
        Noise[0].volume.rampTo(((v*synthGain.x)-35),t); // 2
        Osc[0].volume.rampTo(((v*synthGain.x)-35),t);
        Osc[1].volume.rampTo(((v*synthGain.x)-35),t);
        if (g) {
            rotateDest.x = v * (Math.PI/180);
        }
    },
];
