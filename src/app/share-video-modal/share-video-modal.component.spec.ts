import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareVideoModalComponent } from './share-video-modal.component';

describe('ShareVideoModalComponent', () => {
  let component: ShareVideoModalComponent;
  let fixture: ComponentFixture<ShareVideoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareVideoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareVideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
