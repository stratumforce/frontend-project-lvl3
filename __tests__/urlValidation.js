import validate from '../src/js/lib/urlValidation';

const urls = {
  valid: [
    'http://google.com/',
    'https://hexlet.io/',
    'https://www.somesite.net/feed',
  ],
  invalid: ['', 'http://', 'https://hexlet'],
};

test.each(urls.valid)('Should be valid: %s', (url) => {
  const actual = validate(url);
  return expect(actual).resolves.toBeTruthy();
});

test.each(urls.invalid)('Should be invalid: %s', (url) => {
  const actual = validate(url);
  return expect(actual).resolves.toBeFalsy();
});
