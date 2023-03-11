import { Test, TestingModule } from '@nestjs/testing';
import { VenueGateway } from './venue.gateway';

describe('VenueGateway', () => {
  let gateway: VenueGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenueGateway],
    }).compile();

    gateway = module.get<VenueGateway>(VenueGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
