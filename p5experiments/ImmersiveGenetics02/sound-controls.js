
class GeneSound {

    constructor () {

        this.osc = new p5.SqrOsc();
        this.playing = false;

        this.stopOscillator = () => {
            if (this.osc.started) {
                this.osc.stop();
            }
            this.playing = false;
        }

        this.startOscillator = () => {
            if (!this.osc.started) {
                this.osc.start();
            }
            this.playing = true;
        }

        // Start audio button
        const startButton = createButton("Start Audio");
        startButton.position(10, 320);
        startButton.mousePressed(this.startOscillator);

        // Stop audio button
        const stopButton = createButton("Stop Audio");
        stopButton.position(10, 350);
        stopButton.mousePressed(this.stopOscillator);
    }

    playSound = function(colorVal) {

        if (!this.playing) {
            return;
        }

        let freq_ = map(colorVal, 0, 255, 100, 300);
        this.osc.freq(freq_, 0.1);
        this.osc.amp(0.4, 0.1);
    }
}
