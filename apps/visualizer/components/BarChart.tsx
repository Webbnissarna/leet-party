import { Box, Flex, Grid, Text } from "@theme-ui/components";
import React from "react";

export interface BarInput {
  titles: string[];
  count: number;
  color: string;
}

interface BarChartProps {
  input: BarInput[];
  maxBarHeight: number;
}
export default function BarChart({
  input,
  maxBarHeight,
}: BarChartProps): JSX.Element {
  const maxValue = input.reduce<number>(
    (max, bar) => Math.max(max, bar.count),
    0
  );

  return (
    <Grid
      sx={{
        gap: "md",
        gridTemplateColumns: `repeat(${input.length}, 100px)`,
      }}
    >
      {input.map((bar) => (
        <Flex
          key={bar.titles.join()}
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "sm",
          }}
        >
          <Text sx={{ flexGrow: 1, display: "flex", alignItems: "flex-end" }}>
            {bar.count}
          </Text>
          <Box
            sx={{
              backgroundColor: bar.color,
              height: (bar.count / maxValue) * maxBarHeight,
              width: "70%",
              boxShadow: "main",
              borderRadius: "sm",
            }}
          />
        </Flex>
      ))}
      {input.map((bar) => (
        <Flex
          key={bar.titles.join()}
          sx={{
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Text>{bar.titles.join("+")}</Text>
        </Flex>
      ))}
    </Grid>
  );
}
