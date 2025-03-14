
class GeneSound {

    constructor (panAmt) {

        this.osc = new p5.SqrOsc();
        this.playing = false;
        this.osc.pan(panAmt)

        // this.panner.pan(-1.0);

        // this.stopOscillator = () => {
        //     if (this.osc.started) {
        //         this.osc.stop();
        //     }
        //     this.playing = false;
        // }

        // this.startOscillator = () => {
        //     if (!this.osc.started) {
        //         this.osc.start();
        //     }
        //     this.playing = true;
        // }

        // // Start audio button
        // const startButton = createButton("Start Audio");
        // startButton.position(10, 320);
        // startButton.style("z-index: 1000");
        // startButton.mousePressed(this.startOscillator);

        // // Stop audio button
        // const stopButton = createButton("Stop Audio");
        // stopButton.position(10, 350);
        // stopButton.style("z-index: 1000");
        // stopButton.mousePressed(this.stopOscillator);
    }

    startOscillator = function() {
        if (!this.osc.started) {
            this.osc.start();
        }
        this.playing = true;
    }

    stopOscillator = function() {
        if (this.osc.started) {
            this.osc.stop();
        }
        this.playing = false;
    }

    playSound = function(colorVal) {

        if (!this.playing) {
            return;
        }

        let exponent = (colorVal - 127) / 127;
        let freq_ = 220.0 * (2 ** exponent);
        this.osc.freq(freq_, 0.1);
        this.osc.amp(0.4, 0.1);
    }
}
