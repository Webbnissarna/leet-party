import { Box, Flex, Heading, Text } from "theme-ui";
import Section from "../components/Section";
import { CustomThemeType } from "../utils/theme";

import rawLeetData from "../data/output.json";
import { Output as LeetOutput } from "../types/Types";
import PieChart, { PieSliceInput } from "../components/PieChart";
const leetData: LeetOutput = rawLeetData;

export default function Index() {
  const individualPieSlices = Object.entries(
    leetData.individual
  ).map<PieSliceInput>(([title, count]) => ({ title, count }));

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        paddingY: "lg",
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
        <Text sx={{ fontWeight: "title" }}>1337 stats</Text>
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
          <Text>Hello</Text>
        </Section>

        <Section
          title="Imposters"
          subtitle="Number of times someone tried to fool us with 13:38"
        >
          <Text>Hello</Text>
        </Section>

        <Section title="Special Times">
          <Text>Hello</Text>
        </Section>
      </Flex>
    </Box>
  );
}
