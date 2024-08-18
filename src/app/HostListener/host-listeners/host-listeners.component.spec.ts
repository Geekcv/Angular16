import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostListenersComponent } from './host-listeners.component';

describe('HostListenersComponent', () => {
  let component: HostListenersComponent;
  let fixture: ComponentFixture<HostListenersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostListenersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostListenersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
