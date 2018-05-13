import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { MessageService } from '../message.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  /**
   * Configure `TestBed`
   * @param messageServiceStub Message service or mock
   * @return Promise
   */
  function configureTestingModule(messageServiceStub = { messages: [] }) {
    return TestBed
      .configureTestingModule({
        declarations: [MessagesComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: MessageService, useValue: messageServiceStub },
        ]
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
      });
  }

  it('should create', () => configureTestingModule().then(() => {
    expect(component).toBeTruthy();
  }));

  describe('when message service contains messages', () => {
    const messages = ['foo', 'bar'];
    beforeEach(() => configureTestingModule({ messages }));

    it('should display a "Messages" title', () => {
      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement).toBeDefined();
      expect(titleElement.textContent).toBe('Messages');
    });

    it('should display a "clear" button', () => {
      const clearButtonElement = fixture.nativeElement.querySelector('button.clear');
      expect(clearButtonElement).toBeDefined();
      expect(clearButtonElement.textContent).toBe('clear');
    });

    it('should display messages from the message service', () => {
      const messageElements = fixture.nativeElement.querySelector('div').querySelectorAll('div');
      expect(messageElements.length).toBe(2);

      const displayedMessages = Array.from(messageElements).map((d: HTMLElement) => d.textContent);
      expect(displayedMessages).toEqual(messages);
    });

    describe('#clear button', () => {
      it('should empty the message list when clicked', () => {
        component.messageService.clear = jasmine.createSpy('clear');

        const clearButtonElement = fixture.nativeElement.querySelector('button.clear');
        clearButtonElement.click();
        expect(component.messageService.clear).toHaveBeenCalled();
      });
    });
  });

  describe('when message service contains no message', () => {
    const messages = [];
    beforeEach(() => configureTestingModule({ messages: [] }));

    it('should not display "Messages"', () => {
      expect(fixture.nativeElement).not.toContain('Messages');
    });

    it('should not display any button', () => {
      expect(fixture.nativeElement.querySelectorAll('button').length).toBe(0);
    });

    it('should not display the container element', () => {
      expect(fixture.nativeElement.querySelector('div')).toBe(null);
    });
  });
});
