import { TestBed, inject } from '@angular/core/testing';

import { PlayerManagerService } from './player-manager.service';

describe('PlayerManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerManagerService]
    });
  });

  it('should be created', inject([PlayerManagerService], (service: PlayerManagerService) => {
    expect(service).toBeTruthy();
  }));
});
