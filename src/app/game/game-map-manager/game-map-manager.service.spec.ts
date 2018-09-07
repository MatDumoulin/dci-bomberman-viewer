import { TestBed, inject } from '@angular/core/testing';

import { GameMapManagerService } from './game-map-manager.service';

describe('GameMapManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameMapManagerService]
    });
  });

  it('should be created', inject([GameMapManagerService], (service: GameMapManagerService) => {
    expect(service).toBeTruthy();
  }));
});
