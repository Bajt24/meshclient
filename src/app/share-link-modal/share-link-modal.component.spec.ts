import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLinkModalComponent } from './share-link-modal.component';

describe('ShareLinkModalComponent', () => {
  let component: ShareLinkModalComponent;
  let fixture: ComponentFixture<ShareLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareLinkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
