import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { StreamType } from 'src/classes/streamtype';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-share-video-modal',
  templateUrl: './share-video-modal.component.html',
  styleUrls: ['./share-video-modal.component.scss']
})
/**
 * modal to get access to user's camera stream
 */
export class ShareVideoModalComponent implements AfterViewInit {

    @ViewChild('modal') modal: ModalDirective;

    streamType = StreamType.Video;
    isWaiting = true;

    constructor(public s: StreamService) {
        
    }
    ngAfterViewInit(): void {
        this.modal.onHide.subscribe(()=>{
            this.isWaiting = true;
            if (this.modal.dismissReason != null)
                this.s.stopVideo(this.s.videoStream, this.streamType);
        });
    }

    retry() {
        this.s.getVideoStream((result: boolean) =>{
            if (!result) 
                this.isWaiting = false;
            //TODO: handle events where camera is disconnected from pc or stops working unexpectedly
        });
    }

    show(): void {
        if (this.isWaiting)
            this.modal.show();
        this.retry();
    }

}
