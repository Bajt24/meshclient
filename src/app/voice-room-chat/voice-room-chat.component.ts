import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Message } from 'src/classes/Message';
import { PeerService } from '../peer.service';

@Component({
  selector: 'app-voice-room-chat',
  templateUrl: './voice-room-chat.component.html',
  styleUrls: ['./voice-room-chat.component.scss']
})

/**
 * component that takes care of displaying user chat
 */
export class VoiceRoomChatComponent implements OnInit {

    @ViewChild("chatInput") chatInput: ElementRef<HTMLInputElement>;
    @ViewChild("chat") chat: ElementRef;
    
    msgs: Message[] = [];
    scrolltop: number = null;

    constructor(private ps: PeerService, private cdref: ChangeDetectorRef) {
        this.ps.onChatMessage.subscribe((m: Message)=>{
            this.msgs.push(m);
            this.scrollToBottom();
        });
    }

    /**
     * whenever a new message is received, we need to scroll down to display it
     */
    scrollToBottom() { 
        this.scrolltop = this.chat.nativeElement.scrollHeight;
        this.cdref.detectChanges();
    }

    ngOnInit(): void {
    }

    sendChatMessage(msg: string) {
        if (msg.length == 0)
            return;
        this.chatInput.nativeElement.value = "";
        this.msgs.push(new Message("me", "Me", new Date(), msg));
        this.ps.sendChatMessage(msg);
        this.scrollToBottom();
    }
}