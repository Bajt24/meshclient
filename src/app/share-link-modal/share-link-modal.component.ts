import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-share-link-modal',
  templateUrl: './share-link-modal.component.html',
  styleUrls: ['./share-link-modal.component.scss']
})
/**
 * simple modal to display link to current room
 */
export class ShareLinkModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('copyBtn',{ read: ElementRef }) copyBtn: ElementRef;
    url: string;
    constructor() {
    }

    ngOnInit(): void {
    }

    show(id: string) {
        this.url = window.location.origin + "/call?id="+id;
        this.modal.show();
        this.copyBtn.nativeElement.disabled = false;
        this.copyBtn.nativeElement.textContent = "Copy to clipboard";
    }
    
    copyToClipboard() {
        navigator.clipboard.writeText(this.url).then(()=>{
            this.copyBtn.nativeElement.disabled = true;
            this.copyBtn.nativeElement.textContent = "DONE!";
        }).catch(()=>{
            
        });
    }
}
