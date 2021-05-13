import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VoiceRoomComponent } from './voice-room/voice-room.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionModalComponent } from './permission-modal/permission-modal.component';
import { LandingComponent } from './landing/landing.component';
import { ShareVideoModalComponent } from './share-video-modal/share-video-modal.component';
import { VoiceRoomChatComponent } from './voice-room-chat/voice-room-chat.component';
import { VoiceChatUsersComponent } from './voice-chat-users/voice-chat-users.component';
import { ScreenShareModalComponent } from './screen-share-modal/screen-share-modal.component';
import { NameModalComponent } from './name-modal/name-modal.component';
import { ShareLinkModalComponent } from './share-link-modal/share-link-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    VoiceRoomComponent,
    PermissionModalComponent,
    LandingComponent,
    ShareVideoModalComponent,
    VoiceRoomChatComponent,
    VoiceChatUsersComponent,
    ScreenShareModalComponent,
    NameModalComponent,
    ShareLinkModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    ResizableModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
