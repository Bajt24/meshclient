/**
 * class used for detecting whenever user is speaking
 */
export class SoundMeter {

    framesSinceAmplitude = 0;
    lastStatus: boolean = null;
    stream: MediaStream;
    speakCallback: (val: boolean)=>void;

    constructor(stream: MediaStream, speakCallback: (val: boolean)=>void) {
        this.stream = stream;
        this.speakCallback = speakCallback;
        this.CreateContext();
    }

    // https://github.com/cwilso/volume-meter

    CreateContext() {
        let audioContext = new window.AudioContext();
		let mediaStreamSource: MediaStreamAudioSourceNode = null;
		var meter: AudioNode = null;
		mediaStreamSource = audioContext.createMediaStreamSource(this.stream);
		meter = this.CreateAudioMeter(audioContext);
        mediaStreamSource.connect(meter);
    }
    
    CreateAudioMeter(audioContext: any) {
        let processor = audioContext.createScriptProcessor(256);
        processor.onaudioprocess = (e: any)=>{
            this.VolumeAudioProcess(e);
        }
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = 0.98;
        processor.averaging = 0.95;
        processor.clipLag = 750;

        processor.connect(audioContext.destination)

        return processor;
    }

    VolumeAudioProcess(event: any) {
        const buf = event.inputBuffer.getChannelData(0);
        var length = buf.length;
        let max = -10;

        for (var i = 0; i < length; i++) {
            if (max < buf[i])
                max = buf[i];
        }

        if (max > 0.05)
            this.framesSinceAmplitude = 0;
        else
            this.framesSinceAmplitude++;
        
        let isActive = max > 0.05 || this.framesSinceAmplitude < 200;
        if (this.lastStatus != isActive) {
            this.speakCallback(isActive);
            this.lastStatus = isActive;
        }
    }
}