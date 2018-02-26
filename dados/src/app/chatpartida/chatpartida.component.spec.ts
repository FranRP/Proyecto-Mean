import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpartidaComponent } from './chatpartida.component';

describe('ChatpartidaComponent', () => {
  let component: ChatpartidaComponent;
  let fixture: ComponentFixture<ChatpartidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatpartidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatpartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
