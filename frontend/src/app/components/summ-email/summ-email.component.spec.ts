import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummEmailComponent } from './summ-email.component';

describe('SummEmailComponent', () => {
  let component: SummEmailComponent;
  let fixture: ComponentFixture<SummEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
