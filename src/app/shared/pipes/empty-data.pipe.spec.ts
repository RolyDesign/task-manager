import { EmptyDataPipe } from './empty-data.pipe';

describe('EmptyDataPipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyDataPipe();
    expect(pipe).toBeTruthy();
  });
});
