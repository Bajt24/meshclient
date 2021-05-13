import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionModalComponent } from '../permission-modal/permission-modal.component';
import { SocketService } from '../socket.service';
import { StreamService } from '../stream.service';
import { first } from 'rxjs/operators'
import { ShareVideoModalComponent } from '../share-video-modal/share-video-modal.component';
import { PeerService } from '../peer.service';
import { PeerWrapper } from 'src/classes/peer';
import { animate, style, transition, trigger } from '@angular/animations';
import { Message } from 'src/classes/Message';
import { ScreenShareModalComponent } from '../screen-share-modal/screen-share-modal.component';
import { StreamType } from 'src/classes/streamtype';
import { NameModalComponent } from '../name-modal/name-modal.component';
import { ShareLinkModalComponent } from '../share-link-modal/share-link-modal.component';

@Component({
  selector: 'app-voice-room',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
            style({opacity: 0}),
            animate('200ms', style({'opacity': 1}))
        ]
      )
        ]
    )
  ],
  templateUrl: './voice-room.component.html',
  styleUrls: ['./voice-room.component.scss']
})
/**
 * Main component of our app that represents the conference call
 */
export class VoiceRoomComponent implements OnInit,AfterViewInit {

    @ViewChild(ShareVideoModalComponent) shareVideoModal: ShareVideoModalComponent;
    @ViewChild(ScreenShareModalComponent) screenshareModal: ScreenShareModalComponent;
    @ViewChild(PermissionModalComponent) permissionModal: PermissionModalComponent;
    @ViewChild(NameModalComponent) nameModal: NameModalComponent;
    @ViewChild(ShareLinkModalComponent) shareLinkModal: ShareLinkModalComponent;

    name: string = "";
    selectedUser: PeerWrapper;
    timeSinceStart: number;
    id: string;
    roomName: string;
    isPrivate: boolean;

    streamVideoType = StreamType.Video;
    streamScreenType = StreamType.Screenshare;

    unseenMessages: number = 0;
    sidebarOpened: boolean = false;
    chatTabSelected: boolean = true;
    meetingTimer: NodeJS.Timeout;

    constructor(public s: StreamService, private route: ActivatedRoute, public ps: PeerService, public socket: SocketService, private router: Router, private cdref: ChangeDetectorRef) {
    }
    
    ngAfterViewInit(): void {
        // after user fills his name, we proceed to get his microphone
        this.nameModal.show((name: string)=>{
            this.ps.getPeer("me").name = name;
            this.socket.setName(name);
            this.permissionModal.show();
        });
    }

    ngOnInit(): void {
        // handle adress bar room key
        this.route.queryParams.pipe(first()).subscribe(params => {
            this.id = params["id"];
            this.roomName = params["roomName"];
            this.isPrivate = params["isPrivate"];
        });
        
        this.s.onMicrophoneStream.pipe(first()).subscribe(()=>{
            if (this.id)
                this.socket.joinRoom(this.id);
            else
                this.socket.createRoom(this.roomName,this.isPrivate); 
            
            if (this.s.stream) {
                this.ps.getPeer("me").setSoundMeter(this.s.stream);
                this.ps.getPeer("me").isMuted = false;
            } else {
                this.ps.getPeer("me").isMuted = true;
            }
        });
        // we need to update user ui based on speaking 
        this.ps.onSoundMeterChange.subscribe(()=>{
            this.cdref.detectChanges();
        });      
        
        // handle unseen messages whenever chat is not opened
        this.ps.onChatMessage.subscribe((m: Message)=>{
        if (!this.sidebarOpened || (this.sidebarOpened && !this.chatTabSelected))
            this.unseenMessages++;
        })

        let me = new PeerWrapper("me");
        me.connected = true;
        this.ps.setPeer("me", me);
        this.selectedUser = me;

        this.socket.onRoomCreated.subscribe(this.onRoomCreated.bind(this));
        this.socket.onRoomJoined.subscribe(this.onRoomJoined.bind(this));
    }

    openVideoModal(): void {
        this.shareVideoModal.show()
    }

    openScreenshareModal() {
        this.screenshareModal.show();
    }

    openShareLinkModal() {
        this.shareLinkModal.show(this.id);
    }
    /**
     * function designed to cleanup after finishing a call
     */
    leaveCall() {
        this.ps.disconnect();
        this.socket.leaveRoom();
        this.s.stopVideoTracks(this.s.videoStream);
        this.s.stopVideoTracks(this.s.screenStream);
        this.s.stopAudioTracks();
        this.selectedUser = null;
        this.id = null;
        clearInterval(this.meetingTimer);
        this.router.navigate(['/landing']);
    }
    
    onRoomCreated(key: string) {
        // displaying the created key in the url
        this.id = key;
        this.router.navigate([],{
            relativeTo: this.route,
            queryParams: { id: key }
        });
        this.createTimerForMeeting();
    }

    onRoomJoined(info: any) {
        let success = info.success;
        //TODO: show an error message when the key doesn't exist
        if (!success) 
            this.router.navigate(['/landing']);
        let room = info.room;
        console.log(info);
        this.createTimerForMeeting(room.created);
    }

    toggleMute(): void {
        this.s.$microphoneMuted = !this.s.$microphoneMuted;
    }

    toggleSidebar() {
        this.sidebarOpened = !this.sidebarOpened;
        this.unseenMessages = 0;
    }

    ngOnDestroy() {
        this.leaveCall();
    }

    /**
     * prepares the timer for displaying elapsed time
     * @param timestamp when the call was started
     */
    private createTimerForMeeting(timestamp: number = Date.now()) {
        this.meetingTimer = setInterval(() => {
            let now = Date.now();
            this.timeSinceStart = now-timestamp;
        }, 500)
    }
}
