import { Box } from "theme-ui";
import { senderColorMap } from "../utils/theme";

export interface PieSliceInput {
  title: string;
  count: number;
}

interface PieChartProps {
  input: PieSliceInput[];
}

interface PieSlice {
  start: number;
  arc: number;
  color: string;
  title: string;
  subtitle: string;
  textArcPosition: number[];
}

function getCoordinatesForPercent(percent: number): number[] {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);

  return [x, y];
}

function makePiePath(
  startOffsetArcLengthFraction: number,
  arcLengthFraction: number,
  size: number
): string {
  const halfSize = size / 2;

  const [startX, startY] = getCoordinatesForPercent(
    startOffsetArcLengthFraction
  );
  const [x, y] = getCoordinatesForPercent(
    startOffsetArcLengthFraction + arcLengthFraction
  );
  const largeArcFlag = arcLengthFraction > 0.5 ? 1 : 0;
  return `M ${startX * halfSize} ${
    startY * halfSize
  } A ${halfSize} ${halfSize} 0 ${largeArcFlag} 1 ${x * halfSize} ${
    y * halfSize
  } L 0 0`;
}

function getTextArcPosition(
  sliceArcStart: number,
  sliceArcLength: number,
  scale: number
): number[] {
  const offset = scale * 0.5;
  const arcTime = -0.25 + sliceArcStart + sliceArcLength / 2;
  const [x, y] = getCoordinatesForPercent(arcTime);
  return [x * 0.5 * offset, y * 0.5 * offset];
}

export default function PieChart({ input }: PieChartProps): JSX.Element {
  const drawScale = 720;
  const halfScale = drawScale / 2;
  const totalAmount = input.reduce((acc, slice) => acc + slice.count, 0);

  const slices = input.reduce<{ count: number; slices: PieSlice[] }>(
    (acc, slice) => {
      const newCount = acc.count + slice.count;
      const arcStart = acc.count / totalAmount;
      const arcLength = slice.count / totalAmount;
      const newSlice: PieSlice = {
        start: arcStart,
        arc: arcLength,
        title: slice.title,
        subtitle: slice.count.toString(10),
        color: senderColorMap[slice.title] ?? "#f00",
        textArcPosition: getTextArcPosition(arcStart, arcLength, drawScale),
      };
      return {
        count: newCount,
        slices: [...acc.slices, newSlice],
      };
    },
    { count: 0, slices: [] }
  ).slices;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          boxShadow: "main",
        }}
      >
        <svg width={"100%"} height={"100%"}>
          {slices.map((slice) => (
            <svg
              key={slice.title}
              viewBox={`${-halfScale} ${-halfScale} ${drawScale} ${drawScale}`}
            >
              <path
                d={makePiePath(slice.start, slice.arc, drawScale)}
                fill={slice.color}
                style={{ transform: "rotate(-0.25turn)" }}
              />
              <text
                x={slice.textArcPosition[0]}
                y={slice.textArcPosition[1]}
                style={{
                  fontSize: 28,
                }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {slice.title}
              </text>
              <text
                x={slice.textArcPosition[0]}
                y={slice.textArcPosition[1] + 28}
                style={{ fontSize: 18 }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {slice.subtitle}
              </text>
            </svg>
          ))}
        </svg>
      </Box>
    </Box>
  );
}
