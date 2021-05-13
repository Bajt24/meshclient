import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/classes/Message';
import { PeerWrapper } from 'src/classes/peer';
import { StreamService } from './stream.service';

@Injectable({
  providedIn: 'root'
})
export class PeerService {

    private users: Map<string, PeerWrapper> = new Map();
    private s: StreamService;
    public onChatMessage: Subject<Message> = new Subject();
    public onSoundMeterChange: Subject<void> = new Subject();

    constructor() { 
        return;
        for (let i = 0; i < 20; i++) {
            let p = new PeerWrapper(i.toString(),null);
            p.name = i.toString();
            p.connected = true;
            this.users.set(i.toString(), p);
        }
    }

    isMuted() {
        return this.s.$microphoneMuted;
    }
    
    getLocalVideoStream() {
        return this.s.videoStream;
    }

    getLocalScreenStream() {
        return this.s.screenStream;
    }

    setStreamService(s: StreamService) {
        this.s = s;
        this.s.onMicrophoneToggle.subscribe(this.muted.bind(this));
    }

    getPeer(connectionId: string) : PeerWrapper{
        if (this.users.has(connectionId))
            return this.users.get(connectionId);
        return null;
    }

    setPeer(connectionId: string, user: PeerWrapper) : void {
        user.setPs(this);
        //user.setChangeDetectRef(this.cdref);
        this.users.set(connectionId, user);
    }

    getAllUsers() : Map<string, PeerWrapper>{
        return this.users;
    }
        
    muted(val: boolean) {
        for (let [key, value] of this.users) {
            if (key == "me") {
                value.isMuted = val;
                continue;
            }
            value.sendData("muted", val);
        }
    }
    /**
     * calls disconnect on all peers. used when leaving call by user
     */
    disconnect() {
        for (let [key, value] of this.users) {
            if (key == "me")
                continue;
            value.disconnect();
        }
        this.users.clear();
    }
    /**
     * called whenever the other side closes connection
     */
    onPeerClose(id: string) {
        this.users.delete(id);
    }

    sendChatMessage(msg: string) {
        for (let [key, value] of this.users) {
            if (key == "me")
                continue;
            value.sendData("chat", msg);
        }
        //this.serverPeer.sendData("chat", msg);
    }

    sendData(type: string, msg: string) {
        for (let [key, value] of this.users) {
            if (key == "me")
                continue;
            value.sendData(type, msg);
        }
    }
}
