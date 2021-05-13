import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceRoomChatComponent } from './voice-room-chat.component';

describe('VoiceRoomChatComponent', () => {
  let component: VoiceRoomChatComponent;
  let fixture: ComponentFixture<VoiceRoomChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceRoomChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceRoomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
