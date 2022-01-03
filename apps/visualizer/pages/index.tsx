import { Box, Flex, Heading, Text, Link } from "@theme-ui/components";
import Section from "../components/Section";
import { CustomThemeType, senderColorMap } from "../utils/theme";

import rawLeetData from "../data/output.json";
import { Output as LeetOutput } from "../types/Types";
import PieChart, { PieSliceInput } from "../components/PieChart";
import BarChart, { BarInput } from "../components/BarChart";
const leetData: LeetOutput = rawLeetData;

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
        <Text sx={{ fontWeight: "title" }}>1337 stats 2020-2021</Text>
        <Text sx={{ fontSize: "headline" }}>🎉</Text>

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
          <Flex>
            <Text>A total of&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>{leetData.totalDays} </Text>
            <Text>&nbsp;had at least one 🎉, with a sum of&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>{leetData.total} 🎉</Text>
          </Flex>

          <Flex>
            <Text>The first leet 🎉 was done by&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>{leetData.first.sender} </Text>
            <Text>&nbsp;on&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {timestampToDate(leetData.first.timestamp)}
            </Text>
          </Flex>

          <Flex>
            <Text>The first group leet 🎉 was born on&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {timestampToDate(leetData.firstGroup.timestamp)}
            </Text>
          </Flex>

          <Flex>
            <Text>On average&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {leetData.averageQuickest.sender}
            </Text>
            <Text>&nbsp;was the quickest 🥈️️, reacting roughly&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {Math.round(leetData.averageQuickest.value)} ms
            </Text>
            <Text>&nbsp;before everyone else</Text>
          </Flex>

          <Flex>
            <Text sx={{ fontWeight: "title" }}>{leetData.closest.sender}</Text>
            <Text>&nbsp;cut it close once, reacting just&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {Math.round(leetData.closest.value)} ms
            </Text>
            <Text>&nbsp;before leet ended 🏆</Text>
          </Flex>

          <Flex>
            <Text>Longest streak 🐍 is held by&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {leetData.longestStreak.sender}
            </Text>
            <Text>&nbsp;at&nbsp;</Text>
            <Text sx={{ fontWeight: "title" }}>
              {leetData.longestStreak.value} days
            </Text>
            <Text>&nbsp;in a row!</Text>
          </Flex>
        </Section>

        <Link href="https://github.com/Webbnissarna/leet-party">
          Link to GitHub
        </Link>
      </Flex>
    </Box>
  );
}
