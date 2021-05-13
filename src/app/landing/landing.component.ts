import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import SimplePeer from 'simple-peer';
import { RoomListData } from 'src/classes/roomlistdata';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

/**
 * main component that user sees first when he visitis our page
 * displays the room list and has an option to create an own one
 */
export class LandingComponent implements OnInit {

    constructor(private form: FormBuilder, private router: Router, private socket: SocketService) { 
        socket.onRooms.subscribe((data)=>{
            this.rooms = data;
        })
    }
    isJoinSelected = true;
    joinForm: FormGroup;
    createForm: FormGroup;
    rooms: RoomListData[] = [];
    ngOnInit(): void {
        this.joinForm = this.form.group({
            key: ''
        });
        this.createForm = this.form.group({
            roomName: '',
            isPrivate: false
        });
        this.socket.getRooms();
        // TODO: check webrtc support
        // console.log(SimplePeer.WEBRTC_SUPPORT);
    }


    /**
     * called whenever user submits join form
     * @param data 
     */
    onJoinSubmit(data: FormGroup) {
        if (!data.valid)
            return;
        
        console.log(data.value["key"]);
        this.router.navigate(['/call'],{ queryParams: {id: data.value["key"]}});
        //this.router.navigate(['/call'], data.value["key"]);
    }

    /**
     * called whenever user submits create room form
     * @param data 
     */
    onCreateSubmit(data: FormGroup) {
        if (!data.valid)
        return;

        this.router.navigate(['/call'], {queryParams: {roomName: data.value["roomName"], isPrivate: data.value["isPrivate"]}});
    }

    /**
     * request updated room data
     * @param data 
     */
    refreshRooms() {
        this.socket.getRooms();
    }
}
