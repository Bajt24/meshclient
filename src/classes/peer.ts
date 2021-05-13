import {Injectable } from '@angular/core';
import SimplePeer from 'simple-peer';
import { PeerService } from 'src/app/peer.service';
import { environment } from 'src/environments/environment';
import { ExtendedMediaStream } from './extendedmediastream';
import { Message } from './Message';
import { SoundMeter } from './soundmeter';
import { StreamType } from './streamtype';
@Injectable()

/**
 * class that acts as a wrapper around the peer class from simplepeer
 */
export class PeerWrapper {

    name: string = "emptyName";
    key: string;
    ps: PeerService;
    sound: SoundMeter;
    peer: SimplePeer.Instance;
    connected: boolean = false;
    selectedStream = StreamType.Video;
    volume: number = 1;

    streamMap: Map<string, ExtendedMediaStream> = new Map();
    // opts used for simplepeer
    opts = {
        initiator: true,
        config: { iceServers: [
            { urls: environment.stunIp}, { urls: environment.turnIp, username: environment.turnUser, credential: environment.turnPass }]  },
        trickle: true,
        stream: null
    };
    stream: MediaStream;
    videoStream: MediaStream;
    screenStream: MediaStream;
    public isMuted: boolean = true;
    public isSpeaking: boolean = false;

    onStreamCallback: (stream: MediaStream)=>void;

    started: DOMHighResTimeStamp;

    constructor(key: string, localStream: MediaStream = null) {
        this.key = key;
        this.opts.stream = localStream;
    }

    setLocalStream(localStream: MediaStream) {
        this.opts.stream = localStream;
    }

    changeVolume(val) {
        console.log(val);
        this.volume = val;
    }

    setSoundMeter(stream: MediaStream) {
        this.sound = new SoundMeter(stream,(val: boolean)=>{
            this.isSpeaking = val;
            this.ps.onSoundMeterChange.next();
        });
    }

    onStream(callback: (stream: MediaStream)=>void) {
        this.onStreamCallback = callback;
    }

    setCallbacks() {
        // after we receive stream from another user
        this.peer.on("stream", (stream: MediaStream)=>{
            if (stream.getVideoTracks().length>0) {
                let val = this.streamMap.get(stream.id);
                val.stream = stream;
                if (val.type == StreamType.Video)
                    this.videoStream = stream;
                else
                    this.screenStream = stream;
            } else {
                this.stream = stream;
                this.setSoundMeter(this.stream);
                this.isMuted = false;
            }
        })
    
        this.peer.on("connect", ()=>{
            this.connected = true;
            if (!this.opts.initiator && this.ps.isMuted())
                this.sendData("muted","true");

            this.started = performance.now();
            this.sendData("ping");

            // if we are streaming, we need to send stream to the new client
            let video = this.ps.getLocalVideoStream();
            if (!this.opts.initiator && video!=null) {
                this.sendData("onstream",{id: video.id, type: StreamType.Video});
                this.addStream(video);
            }
            // do the same for screenshare
            let screenshare = this.ps.getLocalScreenStream();
            if (!this.opts.initiator && screenshare!=null) {
                this.sendData("onstream",{id: screenshare.id, type: StreamType.Screenshare});
                this.addStream(screenshare);
            }           

            // send our name
            this.sendData("name", this.ps.getPeer("me").name);
        })
        this.peer.on("error", (error)=>{
            console.log(error);
            //TODO: disconnect?
            this.ps.onPeerClose(this.key);
        });

        this.peer.on("close", ()=>{
            this.ps.onPeerClose(this.key);
        });

        this.peer.on("data", data =>{
            let arr = JSON.parse(data);
            this.processDataEvent(arr.type, arr.data);
            console.log(arr);
        })
    }

    processDataEvent(type: string, data: any) {
        switch (type) {
            case "streamoff": {
                let stream = this.streamMap.get(data);
                if (stream.type == StreamType.Screenshare)
                    this.screenStream = null;
                else
                    this.videoStream = null;
                break;
            }
            case "onstream": {
                this.streamMap.set(data.id, new ExtendedMediaStream(null, data.type));
                break;
            }
            case "muted": {
                this.isMuted = data;
                break;
            }
            case "chat": {
                this.ps.onChatMessage.next(new Message(this.key, this.name, new Date(), data));
                break;
            }
            case "ping": {
                this.sendData("pong");
                break;
            }
            case "pong": {
                let diff = performance.now() - this.started;
                console.log(diff)
                break;
            }
            case "name": {
                this.name = data;
            }
        }
    }

    getAnswer(offer: any, callback: (data)=>void) {
        if (!this.peer) {
            if (offer)
                this.opts.initiator = false;
            this.peer = new SimplePeer(this.opts);
            this.setCallbacks();
            this.peer.on("signal", callback)
        }
        if (offer != null)
            this.peer.signal(offer);
    }

    addStream(stream: MediaStream) {
        this.peer.addStream(stream);
    }

    removeStream(stream: MediaStream) {
        this.peer.removeStream(stream);
        this.sendData("streamoff", stream.id);
    }

    sendData(type: string, data: any = null) {
        let arr = {type: type, data: data };
        console.log("sendData()",arr);
        this.peer.send(JSON.stringify(arr));
    }

    setPs(ps: PeerService) {
        this.ps = ps;
    }
    
    disconnect() {
        this.peer.destroy();
    }

    getSelectedStream() {
        //TODO: refactor this mess
        if (this.selectedStream == StreamType.Video && this.videoStream)
            return this.videoStream;
        else if (this.screenStream && this.selectedStream == StreamType.Screenshare)
            return this.screenStream;
        else if (this.screenStream)
            return this.screenStream;
        else if (this.videoStream)
            return this.videoStream;
        else 
            return null;
    }

    getSecondStream() {
        let s = this.getSelectedStream();
        if (this.videoStream && s.id != this.videoStream.id)
            return this.videoStream;
        else if (this.screenStream && s.id != this.screenStream.id) {
            return this.screenStream;
        } else {
            return s;
        }
    }

    toggleStream() {
        if (this.selectedStream == StreamType.Video) 
            this.selectedStream = StreamType.Screenshare;
        else
            this.selectedStream = StreamType.Video;
    }
}