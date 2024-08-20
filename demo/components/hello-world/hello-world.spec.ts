import { helloWorld } from './hello-world';

it('should return the results of "Hello World!"', () => {
  expect(helloWorld()).toBe('Hello world!');
});
