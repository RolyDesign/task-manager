import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageChatModalComponent } from './message-chat-modal.component';

describe('MessageChatModalComponent', () => {
  let component: MessageChatModalComponent;
  let fixture: ComponentFixture<MessageChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageChatModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
