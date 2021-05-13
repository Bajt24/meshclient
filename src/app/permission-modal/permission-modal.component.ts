import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss']
})

/**
 * modal used whenever user joins a room to get access to his microphone
 */
export class PermissionModalComponent  {

    @ViewChild('modal') modal: ModalDirective;
    isWaiting = true;

    constructor(public s: StreamService) {}

    /**
     * previous attempt wasn't successful, we try a new one
     */
    retry() {
        this.s.getMicrophoneStream((result: boolean) =>{
            if (result)
                this.modal.hide();
            else 
                this.isWaiting = false;
        });
    }

    show(): void {
        this.retry();
        if (this.isWaiting)
            this.modal.show();
    }

    /**
     * in case user selects to continue without a microphone or doesn't have one
     */
    noMic(): void {
        this.s.onMicrophoneStream.next();
    }
}
