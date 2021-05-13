import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { OfferData } from 'src/classes/offerdata';
import { PeerWrapper } from 'src/classes/peer';
import { RoomInfo } from 'src/classes/roominfo';
import { RoomListData } from 'src/classes/roomlistdata';
import { PeerService } from './peer.service';
import { StreamService } from './stream.service';

@Injectable({
  providedIn: 'root'
})

/**
 * simple service responsible for communication with socket.io server
 */
export class SocketService {

    socket: SocketIOClient.Socket;
    onRoomCreated: Subject<string> = new Subject();
    onRoomJoined: Subject<RoomInfo> = new Subject();
    onConnect: Subject<void> = new Subject();
    onPeer: Subject<OfferData> = new Subject(); 
    onRooms: Subject<RoomListData[]> = new Subject();
    
    constructor(private us: PeerService, private s: StreamService) {
        this.connect();
    }

    connect() {
        this.socket = io.connect(window.location.hostname);
        
        this.socket.on("connect", ()=>{
            this.onConnect.next();
        });
        this.socket.on("peer", (offer: OfferData) => {
            // received new offer/answer
            this.onPeer.next();
            // if it's a completely new offerid, set a new peer key
            if (!this.us.getPeer(offer.id))
                this.us.setPeer(offer.id, new PeerWrapper(offer.id, this.s.stream));
                
            let p = this.us.getPeer(offer.id);
            // create offer/answer and send it back
            p.getAnswer(offer.offer, (data: string)=>{
                this.socket.emit("peer", new OfferData(offer.id, data));
            });
        });
        
        // whenever server responds with updated room data, notify our subscribers
        this.socket.on("rooms", (data)=>{
            this.onRooms.next(data);
        });
    }

    /**
     * requests updated rooms info from server
     */
    getRooms() {
        if (!this.socket.connected)
            return;
        this.socket.emit("rooms");
    }

    /**
     * creates room with given params
     * @param name room name
     * @param isPrivate hide the room in list?
     */
    createRoom(name: string, isPrivate: boolean) {
        this.socket.emit("createRoom", {roomName: name, isPrivate: isPrivate}, (key: string)=>{
            this.onRoomCreated.next(key);
            //this.onRoomCreated.emit(key);
        });
    }
    
    /**
     * joins room with given key
     * @param key unique room key
     */
    joinRoom(key: string) {
        this.socket.emit("joinRoom", key, (info: RoomInfo)=>{
            this.onRoomJoined.next(info);
        });
    }

    /**
     * sets name for user on server side, currently not used
     * @param name user name
     */
    setName(name: string) {
        this.socket.emit("setName", name);
    }

    /**
     * used whenever we leave room
     */
    leaveRoom() {
        this.socket.emit("leaveRoom");
    }
}
