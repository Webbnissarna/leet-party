import { ReactNode } from "react";
import { Flex, Heading, Text } from "theme-ui";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode | ReactNode[];
}

export default function Section({
  title,
  subtitle,
  children,
}: SectionProps): JSX.Element {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        gap: "md",
      }}
    >
      <Heading>{title}</Heading>
      {subtitle && <Text>{subtitle}</Text>}
      {children}
    </Flex>
  );
}
