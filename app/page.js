import { Identifier } from "./identifier";

export default async function Home() {
  let hskword = [];

  const fetchHSKWord = async () => {
    const csvFile = await fetch("http://localhost:3000/hskwordv2.csv");
    const hskText = await csvFile.text();
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
  
  const fetchSong = async () => {
    const songFile = await fetch("http://localhost:3000/Gloria.txt");
    return await songFile.text();
  };
  
  await fetchHSKWord();
  const songText = await fetchSong();

  return (<>
    <main>
      <h1 className="py-3 text-center text-4xl text-white">HSK Word Identifier</h1>
      <Identifier text={songText} hskword={hskword} />
    </main>
  </>);
}
