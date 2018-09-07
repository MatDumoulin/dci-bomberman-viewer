import { TestBed, inject } from '@angular/core/testing';

import { GameEngineService } from './game-engine.service';

describe('GameEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameEngineService]
    });
  });

  it('should be created', inject([GameEngineService], (service: GameEngineService) => {
    expect(service).toBeTruthy();
  }));
});
