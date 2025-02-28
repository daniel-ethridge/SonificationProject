class GeneSound {
    constructor (panAmt) {
        this.osc = new p5.SqrOsc();
        this.playing = false;
        
        // Create envelope (will be dynamically adjusted)
        this.env = new p5.Envelope();
        
        // Create and configure reverb (will be dynamically adjusted)
        // this.reverb = new p5.Reverb();
        
        // Connect oscillator to envelope
        this.osc.amp(this.env);
        // Connect oscillator to reverb
        // this.osc.connect(this.reverb);
        
        // Set pan position
        this.osc.pan(panAmt);
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

    playSound = function(colorVal, threshold) {
        if (!this.playing) {
            return;
        }

        // Define musical notes (frequencies in Hz)
        const pentatonicScale = {
            C3: 130.81,
            D3: 146.83,
            F3: 174.61,
            G3: 196.00,
            A3: 220.00
        };

        const pentatonicLow = {
            B2: 123.47,
            Cs3: 138.59,
            Ds3: 155.56,
            Fs3: 185.00,
            Gs3: 207.65
        };

        const pentatonicHigh = {
            B3: 246.94,
            Cs4: 277.18,
            Ds4: 311.13,
            Fs4: 370.00,
            Gs4: 415.30
        };

        let freq_;
        let isWithinThreshold = Math.abs(colorVal) <= threshold;

        // Set envelope and reverb based on whether we're within threshold
        if (isWithinThreshold) {
            // Normal range: softer, shorter release
            this.env.setADSR(0.01, 0.02, 1.0, 0.2); // 200ms release
            this.env.setRange(0.1, 0); // Lower maximum amplitude
            // this.reverb.set(1.5, 1.5); // Less reverb time
            // this.reverb.drywet(0.3); // Less reverb mix
        } else {
            // Outside range: louder, longer release
            this.env.setADSR(0.01, 0.02, 1.0, 2.0); // 800ms release
            this.env.setRange(1.0, 0); // Higher maximum amplitude
            // this.reverb.set(3.0, 2.5); // More reverb time
            // this.reverb.drywet(0.6); // More reverb mix
        }

        // Existing frequency calculation logic
        if (isWithinThreshold) {
            const pentatonicNotes = Object.values(pentatonicScale);
            const normalizedVal = (colorVal + threshold) / (2 * threshold);
            const noteIndex = Math.floor(normalizedVal * (pentatonicNotes.length - 1));
            freq_ = pentatonicNotes[noteIndex];
        } else if (colorVal < -threshold) {
            // Low pentatonic scale mapping for low values
            const lowNotes = Object.values(pentatonicLow);
            if (colorVal <= -threshold - 1) {
                freq_ = lowNotes[0]; // B2
            } else {
                const normalizedVal = (-colorVal - threshold) / 1.0;
                const noteIndex = Math.floor(normalizedVal * (lowNotes.length - 1));
                freq_ = lowNotes[noteIndex];
            }
        } else {
            // High pentatonic scale mapping for high values
            const highNotes = Object.values(pentatonicHigh);
            if (colorVal >= threshold + 1) {
                freq_ = highNotes[highNotes.length - 1]; // Gs4
            } else {
                const normalizedVal = (colorVal - threshold) / 1.0;
                const noteIndex = Math.floor(normalizedVal * (highNotes.length - 1));
                freq_ = highNotes[noteIndex];
            }
        }

        this.osc.freq(freq_, 0.1);
        this.env.triggerAttack(); // Trigger envelope instead of directly setting amplitude
    }
}
