import { Component, Input, OnInit } from '@angular/core';
import { PeerWrapper } from 'src/classes/peer';
import { PeerService } from '../peer.service';

@Component({
  selector: 'app-voice-chat-users',
  templateUrl: './voice-chat-users.component.html',
  styleUrls: ['./voice-chat-users.component.scss']
})
/**
 * component used to display user list
 */
export class VoiceChatUsersComponent  {
    constructor(public ps: PeerService) { }

    /**
     * sets user volume based on range selector
     * @param val number between 0 and 1
     * @param user user
     */
    change(val: number, user: PeerWrapper) {
        user.volume = val;
    }
}
