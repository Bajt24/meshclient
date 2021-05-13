import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnStreamDataMsg } from 'src/classes/datamessages';
import { StreamType } from 'src/classes/streamtype';
import { PeerService } from './peer.service';

@Injectable({
  providedIn: 'root'
})
/**
 * service that takes care of getting access to user media devices
 */
export class StreamService {

    private microphoneMuted = false;

    public stream: MediaStream = null;
    public videoStream: MediaStream;
    public screenStream: MediaStream;

    onMicrophoneStream: Subject<void> = new Subject();
    onVideoStream: Subject<void> = new Subject();
    onScreenStream: Subject<boolean> = new Subject();
    onMicrophoneToggle: Subject<boolean> = new Subject();

    constructor(private ps: PeerService) {        
        ps.setStreamService(this);
    }

    /**
     * sends our videostream to other users
     * @param stream MediaStream source object
     * @param type type
     */
    video(stream: MediaStream, type: StreamType) {
        for (let [key, value] of this.ps.getAllUsers()) {
            if (key == "me")
                continue;
            value.sendData("onstream", new OnStreamDataMsg(stream.id, type));
            value.addStream(stream);
        }
        if (type == StreamType.Video)
            this.ps.getPeer("me").videoStream = this.videoStream;
        else
            this.ps.getPeer("me").screenStream = this.screenStream;
    }
    /**
     * stops streaming of a mediastream we started before
     * @param stream MediaStream source object
     * @param type type
     */
    stopVideo(stream: MediaStream, type: StreamType) {
        for (let [key, value] of this.ps.getAllUsers()) {
            if (key == "me") {
                if (type==StreamType.Video)
                    value.videoStream = null;
                else
                    value.screenStream = null;
                continue;
            }
            value.removeStream(stream);
        }
        this.stopVideoTracks(stream);
        if (type==StreamType.Video)
            this.videoStream = null;
        else
            this.screenStream = null;
    }
    
    stopVideoTracks(stream: MediaStream) {
        // we cant stop all video track simultaneously, we nned to do it one by one
        if (!stream)
            return;
        stream.getVideoTracks().forEach((track)=>{
            track.stop();
        })
    }

    stopAudioTracks() {
        if (!this.stream)
            return;
        this.stream.getAudioTracks().forEach((track)=>{
            track.stop();
        });
    }

    /**
     * requests microphone access from browser
     * @param callback callback to call whenever the attempt was successful or not
     */
    getMicrophoneStream(callback: (result: boolean)=>void) {
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            this.stream = stream;
            // notify our callback, that request was successful
            callback(true);

            this.onMicrophoneStream.next();
        }).catch((err)=>{
            console.log(err);
            callback(false);
        });
    }

    /**
     * requests video camera access from browser
     * @param callback callback to call whenever the attempt was successful or not
     */
    getVideoStream(callback: (result: boolean)=>void) {
        navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
            console.log(stream.getVideoTracks());
            this.videoStream = stream;
            
            callback(true);
            this.onVideoStream.next();
        }).catch((err)=>{
            console.log(err);
            callback(false);
        });
    }

    /**
     * requests screen share from browser
     * @param callback callback to call whenever the attempt was successful or not
     */
    getScreenStream(callback: (result: boolean)=>void) {
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia({video: true}).then((stream: MediaStream) => {
            this.screenStream = stream;
            console.log(stream.getVideoTracks()[0].getSettings())
            callback(true);
            this.onScreenStream.next();
        }).catch((err)=>{
            console.log(err);
            callback(false);
        });
    }

    public get $microphoneMuted(): boolean {
        return this.microphoneMuted;
    }

    public set $microphoneMuted(val: boolean) {
        this.microphoneMuted = val;
        this.stream.getAudioTracks()[0].enabled = !val;
        this.onMicrophoneToggle.next(val);
    }
}
