import words from "../words";

export default function pickWords(n = 25) {
  return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
}
