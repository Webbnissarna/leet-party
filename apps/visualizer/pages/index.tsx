import { Box, Flex, Heading, Text, Link } from "@theme-ui/components";
import Section from "../components/Section";
import { CustomThemeType, senderColorMap } from "../utils/theme";

import rawLeetData from "../data/output.json";
import { Output as LeetOutput } from "../types/Types";
import PieChart, { PieSliceInput } from "../components/PieChart";
import BarChart, { BarInput } from "../components/BarChart";
const leetData: LeetOutput = rawLeetData;

function Bold({ children }): JSX.Element {
  return <Text sx={{ fontWeight: "title" }}>{children}</Text>;
}

function msToSec(ms: number): number {
  return Math.round(ms / 10) / 100;
}

function timestampToDate(timestamp: number): string {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString(10).padStart(2, "0");
  const d = date.getDate().toString(10).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Index() {
  const individualPieSlices = Object.entries(leetData.individual)
    .map<PieSliceInput>(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);

  const combinationInputs = leetData.combinations
    .map<BarInput>((combination) => {
      const color =
        combination.senders.length > 1
          ? senderColorMap[combination.senders.join(",")]
          : senderColorMap[combination.senders[0]];
      return {
        titles: combination.senders.map((s) => s[0]).sort(),
        count: combination.value,
        color: color ?? "#ffffff",
      };
    })
    .sort((a, b) => {
      const counts = a.titles.length - b.titles.length;
      if (counts !== 0) return counts;

      return a.titles.join().localeCompare(b.titles.join());
    });

  const imposters = Object.entries(leetData.imposters)
    .map<BarInput>(([sender, value]) => ({
      titles: [sender],
      count: value,
      color: senderColorMap[sender] ?? "#ffffff",
    }))
    .sort((a, b) => a.titles[0].localeCompare(b.titles[0]));

  return (
    <Box
      sx={{
        width: "100vw",
        margin: 0,
        paddingX: 0,
        paddingY: "lg",
        minHeight: "100vh",
        background: (theme: CustomThemeType) =>
          `linear-gradient(116.82deg, ${theme.colors.gradientTL} 0%, ${theme.colors.gradientBR} 100%);`,
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          gap: "lg",
        }}
      >
        <Heading as={"h1"}>Webbnissarna</Heading>
        <Text sx={{ fontWeight: "title" }}>1337 stats 2020-2021 🎉</Text>

        <Section
          title="Individual"
          subtitle="Number of 🎉 posted at 13:37 per person"
        >
          <PieChart input={individualPieSlices} />
        </Section>

        <Section
          title="Combinations"
          subtitle="Number of times each combination of participants occurred"
        >
          <BarChart input={combinationInputs} maxBarHeight={100} />
        </Section>

        <Section
          title="Imposters"
          subtitle="Number of times someone tried to fool us with 13:38"
        >
          <BarChart input={imposters} maxBarHeight={100} />
        </Section>

        <Section title="Special Times">
          <Flex sx={{ flexDirection: "column", gap: "md" }}>
            <Text>
              A total of <Bold>{leetData.totalDays} days</Bold> had at least one
              🎉, with a sum of {leetData.total} total 🎉
            </Text>

            <Text>
              The first leet 🎉 was done by <Bold>{leetData.first.sender}</Bold>{" "}
              on <Bold>{timestampToDate(leetData.first.timestamp)}</Bold>
            </Text>

            <Text>
              The first group leet 🎉 was born on{" "}
              <Bold>{timestampToDate(leetData.firstGroup.timestamp)}</Bold>
            </Text>

            <Text>
              There were a total of <Bold>{leetData.missed} days</Bold> when
              leet was forgotten 😞
            </Text>

            <Text>
              On average <Bold>{leetData.averageQuickest.sender}</Bold> was the
              quickest, reacting about{" "}
              <Bold>{msToSec(leetData.averageQuickest.value)} sec</Bold> 🥇
              before everyone else
            </Text>

            <Text>
              <Bold>{leetData.closest.sender}</Bold> cut it close once, reacting
              just{" "}
              <Bold>{msToSec(60 * 1000 - leetData.closest.value)} sec</Bold>{" "}
              before leet ended 🏃‍♂️!
            </Text>

            <Text>
              Longest streak 🐍 is held by{" "}
              <Bold>{leetData.longestStreak.sender}</Bold> at{" "}
              <Bold>{leetData.longestStreak.value} days</Bold> in a row!
            </Text>
          </Flex>
        </Section>

        <Link href="https://github.com/Webbnissarna/leet-party">
          Link to GitHub
        </Link>
      </Flex>
    </Box>
  );
}
