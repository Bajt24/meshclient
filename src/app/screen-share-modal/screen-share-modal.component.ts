import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { StreamType } from 'src/classes/streamtype';
import { PeerService } from '../peer.service';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-screen-share-modal',
  templateUrl: './screen-share-modal.component.html',
  styleUrls: ['./screen-share-modal.component.scss']
})
/**
 * modal to get access to user's screen share stream
 */
export class ScreenShareModalComponent implements OnInit, AfterViewInit {

    @ViewChild('modal') modal: ModalDirective;
    streamType = StreamType.Screenshare;
    isWaiting = true;

    constructor(public s: StreamService, public ps: PeerService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.modal.onHide.subscribe(()=>{
            this.isWaiting = true;
            // we need to stop the video access if user closes modal
            if (this.modal.dismissReason != null)
                this.s.stopVideo(this.s.screenStream, this.streamType);
        });
    }

    retry() {
        this.s.getScreenStream((result: boolean) =>{
            if (!result)
                this.isWaiting = false;
            else {
                this.s.screenStream.getVideoTracks()[0].onended = ()=>{
                    // this one handles the button that's shown in chrome in the bottom of the screen
                    // we need to manually notify other users that stream has ended
                    this.ps.sendData("streamoff", this.s.screenStream.id);
                    this.s.screenStream = null;
                    this.ps.getPeer("me").screenStream = null;
                    this.isWaiting = !this.modal.isShown;
                };
            }
        });
    }

    show(): void {
        if (this.isWaiting)
            this.modal.show();
        this.retry();
    }
}
