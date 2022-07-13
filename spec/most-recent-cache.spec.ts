import { Fetcher, MostRecentCache } from '../src/most-recent-cache';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('most recent cache', function () {
  let fetcherSpy: SpyObj<Fetcher<string>>;
  let mostRecentCache: MostRecentCache<string>;

  beforeEach(() => {
    fetcherSpy = createSpyObj<Fetcher<string>>('Fetcher', ['get']);
    fetcherSpy.get.and.callFake(id => `value of ${id}`);
    mostRecentCache = new MostRecentCache<string>(fetcherSpy, 3);
  });

  it('should return correct vales', function () {
    expect(mostRecentCache.get('a')).toBe('value of a');
    expect(mostRecentCache.get('b')).toBe('value of b');
    expect(mostRecentCache.get('c')).toBe('value of c');
  });

  it('should call the fetcher to get new items', function () {
    mostRecentCache.get('a');
    mostRecentCache.get('b');
    mostRecentCache.get('c');

    expect(fetcherSpy.get).toHaveBeenCalledTimes(3);
    expect(fetcherSpy.get.calls.allArgs()).toEqual([
      ['a'],
      ['b'],
      ['c'],
    ]);
  });

  it(`should call the fetcher once as far as it's in the cache limit`, function () {
    mostRecentCache.get('a');
    mostRecentCache.get('b');
    mostRecentCache.get('c');
    mostRecentCache.get('a'); // now it should serve the items from the cache
    mostRecentCache.get('b');
    mostRecentCache.get('c');

    expect(fetcherSpy.get).toHaveBeenCalledTimes(3);
    expect(fetcherSpy.get.calls.allArgs()).toEqual([
      ['a'],
      ['b'],
      ['c'],
    ]);
  });

  it(`should call the fetcher again if cache limit reached`, function () {
    mostRecentCache.get('a');
    mostRecentCache.get('b');
    mostRecentCache.get('c');
    mostRecentCache.get('d'); // because the cache limit is 3, `a` should be deleted from the cache
    mostRecentCache.get('a'); // since `a` is not the cache, it should be fetched again
    expect(fetcherSpy.get).toHaveBeenCalledTimes(5);
    expect(fetcherSpy.get.calls.allArgs()).toEqual([
      ['a'],
      ['b'],
      ['c'],
      ['d'],
      ['a'],
    ]);
  });

  it(`should work based on read not write`, function () {
    mostRecentCache.get('a');
    mostRecentCache.get('b');
    mostRecentCache.get('c');
    mostRecentCache.get('a'); // now `a` should be updated to the most recent, to have the cache `[b, c, a]`
    mostRecentCache.get('d'); // now `d` should replace `b`, to have the cache `[c, a, d]`
    mostRecentCache.get('a'); // since `a` in the cache, it shouldn't fetch it again
    expect(fetcherSpy.get).toHaveBeenCalledTimes(4);
    expect(fetcherSpy.get.calls.allArgs()).toEqual([
      ['a'],
      ['b'],
      ['c'],
      ['d'],
    ]);
  });
});
