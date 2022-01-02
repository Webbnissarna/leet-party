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
}

function getCoordinatesForPercent(percent: number): number[] {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);

  return [x, y];
}

function makePiePath(
  startOffsetArcLengthFraction: number,
  arcLengthFraction: number
): string {
  const [startX, startY] = getCoordinatesForPercent(
    startOffsetArcLengthFraction
  );
  const [x, y] = getCoordinatesForPercent(
    startOffsetArcLengthFraction + arcLengthFraction
  );
  const largeArcFlag = arcLengthFraction > 0.5 ? 1 : 0;
  return `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${x} ${y} L 0 0`;
}

export default function PieChart({ input }: PieChartProps): JSX.Element {
  const totalAmount = input.reduce((acc, slice) => acc + slice.count, 0);

  const slices = input.reduce<{ count: number; slices: PieSlice[] }>(
    (acc, slice) => {
      const newCount = acc.count + slice.count;
      const newSlice: PieSlice = {
        start: acc.count / totalAmount,
        arc: slice.count / totalAmount,
        title: slice.title,
        subtitle: slice.count.toString(10),
        color: senderColorMap[slice.title] ?? "#f00",
      };
      return {
        count: newCount,
        slices: [...acc.slices, newSlice],
      };
    },
    { count: 0, slices: [] }
  ).slices;

  const drawScale = 720;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
        }}
      >
        <svg
          width={"100%"}
          height={"100%"}
          viewBox={`${-drawScale} ${-drawScale} ${drawScale * 2} ${
            drawScale * 2
          }`}
        >
          {slices.map((slice) => (
            <>
              <path
                key={slice.title}
                d={makePiePath(slice.start, slice.arc)}
                fill={slice.color}
                style={{ transform: "rotate(-0.25turn)" }}
              />
              <text x={0} y={0} style={{ fontSize: 28 }}>
                Hello
              </text>
            </>
          ))}
        </svg>
      </Box>
    </Box>
  );
}
