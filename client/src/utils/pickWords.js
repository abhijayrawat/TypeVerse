import { generate } from 'random-words';

export default function pickWords(n = 25) {
  return generate({ exactly: n, maxLength: 10, minLength: 3 });
}
