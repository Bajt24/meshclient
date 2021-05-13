import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { VoiceRoomComponent } from './voice-room/voice-room.component';

const routes: Routes = [
    {
        path: 'call', component: VoiceRoomComponent
    },
    {
        path: 'landing', component: LandingComponent
    },
    {
        path: '**', redirectTo: '/landing'
    } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
