import { readFileSync } from "node:fs";
import { Identifier } from "./identifier";

export default async function Home() {
  let hskword = [];

  const fetchHSKWord = () => {
    const hskText = readFileSync("public/hskwordv2.csv", "utf8");
    const linesHSK = hskText.match(/[^\n]+/g);
    for (const line of linesHSK) {
      hskword.push(line.split(','));
    }
    hskword = hskword.map(elem => {
      return {
        word: elem[0],
        level: elem[1],
        wordLength: elem[2]
      }
    });
  };
  
  fetchHSKWord();
  const songText = readFileSync("public/Gloria.txt", "utf8");

  return (<>
    <main>
      <h1 className="py-3 text-center text-4xl text-white">HSK Word Identifier</h1>
      <Identifier text={songText} hskword={hskword} />
    </main>
  </>);
}
