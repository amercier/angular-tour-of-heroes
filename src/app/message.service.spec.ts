import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
  });

  it('should be created', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created with an empty messages list', inject([MessageService], (service: MessageService) => {
    expect(service.messages).toEqual([]);
  }));

  describe('#add', () => {
    it('should add the given message to the list', inject([MessageService], (service: MessageService) => {
      service.add('foo');
      service.add('bar');
      expect(service.messages).toEqual(['foo', 'bar']);
    }));
  });

  describe('#clear', () => {
    it('should empty the message list', inject([MessageService], (service: MessageService) => {
      service.add('foo');
      service.add('bar');
      service.clear();
      expect(service.messages).toEqual([]);
    }));
  });
});
