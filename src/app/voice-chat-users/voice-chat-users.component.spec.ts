import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceChatUsersComponent } from './voice-chat-users.component';

describe('VoiceChatUsersComponent', () => {
  let component: VoiceChatUsersComponent;
  let fixture: ComponentFixture<VoiceChatUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceChatUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceChatUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
