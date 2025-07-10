import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function LinePlot({
  data,
  width = 300,
  height = 150,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 20,
  marginLeft = 40
}) {
  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear([1, 6], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear([0, 100], [height - marginBottom, marginTop]);
  const line = d3.line(d => x(d.level), d => y(d.percent));
  useEffect(() => {
    d3.select(gx.current).call(d3.axisBottom(x).ticks(6));
    d3.select(gy.current).call(d3.axisLeft(y));
  }, []);
  return (
    <svg width={width} height={height} className="rounded-xl bg-[#b5e48c]">
      <g ref={gx} transform={`translate(0, ${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
      <path fill="none" stroke="#168aad" strokeWidth="2" d={line(data)} />
      <g fill="white" stroke="#168aad" strokeWidth="1.5">
        {data.map((d, i) => (<circle key={i} cx={x(d.level)} cy={y(d.percent)} r="2.5" />))}
      </g>
    </svg>
  );
}