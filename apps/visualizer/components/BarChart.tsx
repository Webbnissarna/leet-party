import { Box, Flex, Grid, Text } from "@theme-ui/components";
import React, { useRef } from "react";
import { useIntersectionValue } from "../hooks/useIntersectionValue";
import { CustomThemeType } from "../utils/theme";

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
  const observableRef = useRef(null);
  const isInView = useIntersectionValue(observableRef, true, false, true);

  const maxValue = input.reduce<number>(
    (max, bar) => Math.max(max, bar.count),
    0
  );

  const maxWidthPerBarCell = Math.floor(100 / input.length);

  return (
    <Grid
      ref={observableRef}
      sx={{
        gap: "md",
        gridTemplateColumns: (theme: CustomThemeType) =>
          `repeat(${input.length}, min(calc(${maxWidthPerBarCell}vw - ${
            theme.space.md * 1.2
          }px), 100px))`,
        maxWidth: "100vw",
        padding: "sm",
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
            height: maxBarHeight,
          }}
        >
          <Text sx={{ flexGrow: 1, display: "flex", alignItems: "flex-end" }}>
            {bar.count}
          </Text>
          <Box
            sx={{
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "70%",
              borderRadius: "sm",
              height: `${Math.round(
                (bar.count / maxValue) * 100 * (isInView ? 1 : 0)
              )}%`,
              transition: "height 1s ease-out",
              boxShadow: "main",
              backgroundColor: bar.color,
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
          <Text
            sx={{
              fontSize: "sm",
            }}
          >
            {bar.titles.join("+")}
          </Text>
        </Flex>
      ))}
    </Grid>
  );
}
