import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss']
})
/**
 * modal that we use to set username
 */
export class NameModalComponent implements OnInit {

    nameForm: FormGroup;
    callback: (name: string)=>void;
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('name', {static: true}) nameInput: ElementRef;
    @ViewChild('continue', {static: false}) continueBtn: ElementRef;

    isDisabled: boolean = true;

    constructor(private form: FormBuilder) { }

    ngOnInit(): void {
        this.nameForm = this.form.group({
            name: '',
        });

        this.nameForm.valueChanges.subscribe(()=>{
            this.isDisabled = this.nameForm.value.name.length < 1;
        });
        // here we check our localstorage for previous saved name
        // if we a record then we set it to the textbox
        let lname = localStorage.getItem("name");
        if (lname) {
            this.nameForm.setValue({name: lname});
            this.isDisabled = false;
        }
    }
    
    onSubmit(val: FormGroup) {
        if (val.status == "VALID") {
            localStorage.setItem("name", val.value.name);
            this.callback(val.value.name);
            this.modal.hide();
        }   
    }

    show(callback: (name: string)=>void) {
        this.modal.show();
        this.callback = callback;
    }
}
