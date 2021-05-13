import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenShareModalComponent } from './screen-share-modal.component';

describe('ScreenShareModalComponent', () => {
  let component: ScreenShareModalComponent;
  let fixture: ComponentFixture<ScreenShareModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenShareModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenShareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
