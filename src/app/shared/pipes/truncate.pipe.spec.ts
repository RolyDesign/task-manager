import { TruncatePipe } from './truncate.pipe';

describe('TrucatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });
});
