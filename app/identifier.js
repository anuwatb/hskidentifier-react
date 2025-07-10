'use client';

import { useRef, useState } from "react";
import clsx from "clsx";
import LinePlot from "./graphics";

export function Identifier({ text, hskword }) {
  const textarea = useRef(null);
  let textChinese = '';
  let countByLevelNext = [0, 0, 0, 0, 0, 0];
  const [ textResult, setTextResult ] = useState(identify(text));
  const [ lengthTextChinese, setlengthTextChinese ] = useState(textChinese.length);
  const [ countByLevel, setcountByLevel ] = useState(countByLevelNext);
  let acc = 0;
  const countByLevelAcc = countByLevel.map(elem => acc += elem);
  let percentAcc = countByLevelAcc.map(elem => Math.round((elem / lengthTextChinese) * 100) || 0);
  const dataLinePlot = percentAcc.map((elem, index) => { return { level: index + 1, percent: elem } });

  function identify(text) {
    const matchChinese = text.match(/[一-鿕]+/g);
    if (matchChinese !== null) {
      for (const match of matchChinese) {
        textChinese += match;
      }
    }

    let textByLine = [];
    const linesText = text.match(/[^\n]+/g);
    if (linesText !== null) {
      for (const line of linesText) {
        textByLine.push(line);
      }
    }

    let textIdentified = [];
    for (let l = 0; l < textByLine.length; l++) {
      textIdentified.push([]);
      const lengthLine = textByLine[l].length;
      for (let i = 0; i < lengthLine; i++) {
        textIdentified[l].push({
          character: textByLine[l].substring(i, i+1),
          level: '0'
        });
      }
      for (let j = 0; j < hskword.length; j++) {
        let start = 0;
        for (let i = 0; i < lengthLine; i++) {
          let pos = textByLine[l].indexOf(hskword[j].word, start);
          if (pos >= 0) {
            for (let k = 0; k < parseInt(hskword[j].wordLength); k++) {
              if (textIdentified[l][pos].level == '0') {
                textIdentified[l][pos].level = hskword[j].level;
                countByLevelNext[parseInt(hskword[j].level) - 1]++;
              }
              pos++;
            }
            start = pos;
          }
          else {
            break;
          }
        }
      }
    }
    return textIdentified;
  }

  const handleClear = () => {
    textarea.current.value = null;
  };

  const handleIdentify = () => {
    textChinese = '';
    countByLevelNext = [0, 0, 0, 0, 0, 0];
    setTextResult(identify(textarea.current.value.replace('\n', '\n\r')));
    setlengthTextChinese(textChinese.length);
    setcountByLevel(countByLevelNext);
  };
  
  return (<>
    <textarea
      ref={textarea}
      placeholder="Chinese text"
      rows={5}
      className="mt-4 w-full resize-none rounded-xl bg-white px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus:outline-4 focus:-outline-offset-4 focus:outline-[#184e77]"
    />
    <div className="mt-2 flex justify-end gap-x-2">
      <button className="rounded-md px-3 py-2 text-white hover:bg-[#b5e48c]" onClick={handleClear}>
        Clear
      </button>
      <button
        className="rounded-lg bg-[#184e77] px-3 py-2 text-white hover:bg-[#168aad] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleIdentify}
      >
        Identify
      </button>
    </div>
    <div className="rounded-xl bg-[#99d98c] mt-6 p-4 flex justify-around items-center flex-wrap">
      <div className="text-sm text-white font-bold tracking-wider">
        {countByLevel.map((elem, index) => {
          return (
            <div key={index}>
              Level {index === 0 ? '' : '1-'}
              <span className={clsx("p-0.5", {
                "bg-orange-400": index === 0,
                "bg-red-600": index === 1,
                "bg-green-600": index === 2,
                "bg-blue-500": index === 3,
                "bg-purple-800": index === 4,
                "bg-black": index === 5,
              }, "text-white")}>
                {index + 1}
              </span> {percentAcc[index]}% ({countByLevelAcc[index]}/{lengthTextChinese} Chinese characters)
            </div>
          );
        })}
      </div>
      <LinePlot data={dataLinePlot} />
    </div>
    <div className="relative rounded-xl bg-white mt-6 px-3 py-1.5 whitespace-pre-wrap">
      <div className={clsx({
        "hidden": textarea.current !== null,
      }, "absolute right-px text-xs text-gray-500")}>
        Lyrics of G.E.M.邓紫棋《Gloria》
      </div>
      {textResult.map((line, indexLine) => {
        return (
          <div key={indexLine}>
            {line.map((char, indexChar) => {
              return (
                <span key={indexChar} className={clsx("py-0.5", {
                  "": char.level === "0",
                  "text-white bg-orange-400": char.level === "1",
                  "text-white bg-red-600": char.level === "2",
                  "text-white bg-green-600": char.level === "3",
                  "text-white bg-blue-500": char.level === "4",
                  "text-white bg-purple-800": char.level === "5",
                  "text-white bg-black": char.level === "6",
                },)}>
                  {char.character}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  </>);
}