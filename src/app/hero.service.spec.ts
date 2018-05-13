import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { asyncData, asyncError } from '../testing/async-observable-helpers';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

describe('HeroService', () => {
  let httpClientSpy: {
    get: jasmine.Spy,
    put: jasmine.Spy,
    post: jasmine.Spy,
    delete: jasmine.Spy
  };
  let messageServiceSpy: { add: jasmine.Spy };
  let heroService: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        MessageService
      ],
      imports: [
        HttpClientModule
      ],
    });

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post', 'delete']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    heroService = new HeroService(<any> httpClientSpy, <any> messageServiceSpy);
  });
  it('should be created', inject([HeroService], (service: HeroService) => {
    expect(heroService).toBeTruthy();
  }));

  describe('#getHeroes', () => {
    it('should fetch GET /api/heroes', () => {
      httpClientSpy.get.and.returnValue(asyncData([]));
      heroService.getHeroes();
      expect(httpClientSpy.get.calls.allArgs()).toEqual([['api/heroes']]);
    });

    describe('when GET /api/heroes returns 200 OK', () => {
      const heroes: Hero[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

      beforeEach(() => {
        httpClientSpy.get.and.returnValue(asyncData(heroes));
      });

      it('should return expected heroes', async () => {
        const response = await heroService.getHeroes().toPromise();
        expect(response).toEqual(heroes);
      });

      it('should add a message to the message service', async () => {
        await heroService.getHeroes().toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: fetched heroes']]);
      });
    });

    describe('when GET /api/heroes returns 404 Not Found', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        httpClientSpy.get.and.returnValue(asyncError(errorResponse));
      });

      it('should return an empty list of heroes', async () => {
        const response = await heroService.getHeroes().toPromise();
        expect(response).toEqual([]);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: getHeroes failed: Http failure response for (unknown url): 404 Not Found';
        await heroService.getHeroes().toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });

  describe('#getHero', () => {
    it('should fetch GET /api/heroes/{id}', () => {
      httpClientSpy.get.and.returnValue(asyncData({}));
      heroService.getHero(1);
      expect(httpClientSpy.get.calls.allArgs()).toEqual([['api/heroes/1']]);
    });

    describe('when GET /api/heroes/{id} returns 200 OK', () => {
      const hero: Hero = { id: 1, name: 'A' };

      beforeEach(() => {
        httpClientSpy.get.and.returnValue(asyncData(hero));
      });

      it('should return expected hero', async () => {
        const response = await heroService.getHero(1).toPromise();
        expect(response).toEqual(hero);
      });

      it('should add a message to the message service', async () => {
        await heroService.getHero(1).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: fetched hero id=1']]);
      });
    });

    describe('when GET /api/heroes/{id} returns 404 Not Found', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        httpClientSpy.get.and.returnValue(asyncError(errorResponse));
      });

      it('should return undefined', async () => {
        const response = await heroService.getHero(1).toPromise();
        expect(response).toBe(undefined);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: getHero id=1 failed: Http failure response for (unknown url): 404 Not Found';
        await heroService.getHero(1).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });

  describe('#updateHero', () => {
    const hero: Hero = { id: 1, name: 'A' };

    it('should call PUT /api/heroes/{id}', () => {
      httpClientSpy.put.and.returnValue(asyncData({}));
      heroService.updateHero(hero);
      expect(httpClientSpy.put.calls.allArgs()).toEqual([['api/heroes', hero, jasmine.any(Object)]]);
    });

    describe('when PUT /api/heroes/{id} returns 200 OK', () => {
      beforeEach(() => {
        httpClientSpy.put.and.returnValue(asyncData(hero));
      });

      it('should return the updated hero', async () => {
        const response = await heroService.updateHero(hero).toPromise();
        expect(response).toEqual(hero);
      });

      it('should add a message to the message service', async () => {
        await heroService.updateHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: updated hero id=1']]);
      });
    });

    describe('when PUT /api/heroes/{id} returns 404 Not Found', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        httpClientSpy.put.and.returnValue(asyncError(errorResponse));
      });

      it('should return undefined', async () => {
        const response = await heroService.updateHero(hero).toPromise();
        expect(response).toBe(undefined);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: updateHero failed: Http failure response for (unknown url): 404 Not Found';
        await heroService.updateHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });

  describe('#addHero', () => {
    const hero: Hero = { id: 1, name: 'A' };

    it('should call POST /api/heroes', () => {
      httpClientSpy.post.and.returnValue(asyncData({}));
      heroService.addHero(hero);
      expect(httpClientSpy.post.calls.allArgs()).toEqual([['api/heroes', hero, jasmine.any(Object)]]);
    });

    describe('when POST /api/heroes returns 201 Created', () => {
      beforeEach(() => {
        httpClientSpy.post.and.returnValue(asyncData(hero));
      });

      it('should return the added hero', async () => {
        const response = await heroService.addHero(hero).toPromise();
        expect(response).toEqual(hero);
      });

      it('should add a message to the message service', async () => {
        await heroService.addHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: added hero w/ id=1']]);
      });
    });

    describe('when POST /api/heroes returns 403 Forbidden', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
        httpClientSpy.post.and.returnValue(asyncError(errorResponse));
      });

      it('should return undefined', async () => {
        const response = await heroService.addHero(hero).toPromise();
        expect(response).toBe(undefined);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: addHero failed: Http failure response for (unknown url): 403 Forbidden';
        await heroService.addHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });

  describe('#deleteHero', () => {
    const hero: Hero = { id: 1, name: 'A' };

    it('should call DELETE /api/heroes/{id}', () => {
      httpClientSpy.delete.and.returnValue(asyncData({}));
      heroService.deleteHero(hero);
      expect(httpClientSpy.delete.calls.allArgs()).toEqual([['api/heroes/1', jasmine.any(Object)]]);
    });

    describe('when DELETE /api/heroes/{id} returns 204 No Content', () => {
      beforeEach(() => {
        httpClientSpy.delete.and.returnValue(asyncData(undefined));
      });

      it('should return undefined', async () => {
        const response = await heroService.deleteHero(hero).toPromise();
        expect(response).toBe(undefined);
      });

      it('should add a message to the message service', async () => {
        await heroService.deleteHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: deleted hero id=1']]);
      });
    });

    describe('when DELETE /api/heroes/{id} returns 404 Not Found', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        httpClientSpy.delete.and.returnValue(asyncError(errorResponse));
      });

      it('should return undefined', async () => {
        const response = await heroService.deleteHero(hero).toPromise();
        expect(response).toBe(undefined);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: deleteHero failed: Http failure response for (unknown url): 404 Not Found';
        await heroService.deleteHero(hero).toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });

  describe('#searchHeroes', () => {
    it('should call GET /api/heroes/?name={query}', () => {
      httpClientSpy.get.and.returnValue(asyncData({}));
      heroService.searchHeroes('foo');
      expect(httpClientSpy.get.calls.allArgs()).toEqual([['api/heroes/?name=foo']]);
    });

    describe('when GET /api/heroes/?name={query} returns 200 OK', () => {
      const heroes: Hero[] = [{ id: 1, name: 'fooA' }, { id: 2, name: 'fooB' }];

      beforeEach(() => {
        httpClientSpy.get.and.returnValue(asyncData(heroes));
      });

      it('should return expected heroes', async () => {
        const response = await heroService.searchHeroes('foo').toPromise();
        expect(response).toEqual(heroes);
      });

      it('should add a message to the message service', async () => {
        await heroService.searchHeroes('foo').toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([['HeroService: found heroes matching "foo"']]);
      });
    });

    describe('when GET /api/heroes/?name={query} returns 404 Not Found', () => {
      beforeEach(() => {
        const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        httpClientSpy.get.and.returnValue(asyncError(errorResponse));
      });

      it('should return an empty list of heroes', async () => {
        const response = await heroService.searchHeroes('foo').toPromise();
        expect(response).toEqual([]);
      });

      it('should add a message to the message service', async () => {
        const errorMessage = 'HeroService: searchHeroes failed: Http failure response for (unknown url): 404 Not Found';
        await heroService.searchHeroes('foo').toPromise();
        expect(messageServiceSpy.add.calls.allArgs()).toEqual([[errorMessage]]);
      });
    });
  });
});
