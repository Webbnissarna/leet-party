import { promises as fs } from "fs";
import path from "path";
import {
  RelativeTimingWithTimestamp,
  Timestamp,
  SenderValuePair,
  SenderValueMap,
  MultipleSenderValuePair,
  Output,
} from "Types";

const DATA_BASE_DIR = path.join("./data");
const DATA_INPUT_DIR = path.join(DATA_BASE_DIR, "input");
const DATA_OUTPUT_DIR = path.join(DATA_BASE_DIR, "output");
const LEET_MARKER = "🎉";

interface Message {
  sender_name: string;
  timestamp_ms: number;
  timestamp?: Date;
  content: string;
  type: string;
  is_unsent: boolean;
}

interface MessageDigest {
  participants: { name: string }[];
  messages: Message[];
}

interface DateGroupedMessages {
  [date: string]: Message[];
}

interface TimingsGroupedByKey {
  [name: string]: RelativeTimingWithTimestamp[];
}

interface TimingsByFirstSender {
  [sender: string]: TimingsGroupedByKey;
}

interface TimestampsBySenderAsKey {
  [name: string]: Timestamp[];
}

interface CombinationTimestamps {
  senders: string[];
  timestamps: Timestamp[];
}

function fakeUnicodeBytesToString(input: string): string {
  const byteTexts = input
    .split("\\u")
    .filter((b) => b)
    .map((b) => `0x${b}`);
  const bytes = byteTexts.map((b) => parseInt(b));
  return Buffer.from(bytes).toString("utf-8");
}

function fixFakeUnicode(input: string): string {
  const regex = /[^\\]?((\\u[0-9a-f]{4})+)/g;
  return input.replace(regex, (s, match) =>
    s.replace(match, fakeUnicodeBytesToString(match))
  );
}

async function loadData<T>(filename: string): Promise<T> {
  const fullPath = path.join(DATA_INPUT_DIR, filename);
  console.log("reading", fullPath);
  const content = await fs.readFile(fullPath, "utf-8");
  const fixed = fixFakeUnicode(content);
  return JSON.parse(fixed);
}

function mergeMessages(digests: MessageDigest[]): Message[] {
  const messages = digests.reduce<Message[]>((acc, digest) => {
    return [...acc, ...digest.messages];
  }, []);

  return messages.sort((a, b) => a.timestamp_ms - b.timestamp_ms);
}

function timestampMessages(messages: Message[]): Message[] {
  return messages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp_ms),
  }));
}

function isWithinLeet(message: Message): boolean {
  return (
    message.timestamp &&
    message.timestamp.getHours() === 13 &&
    message.timestamp.getMinutes() === 37
  );
}

function isFakeLeet(message: Message): boolean {
  return (
    message.timestamp &&
    message.timestamp.getHours() === 13 &&
    message.timestamp.getMinutes() === 38
  );
}

function isLeet(message: Message): boolean {
  return message.content === LEET_MARKER;
}

function reduceToTimestampsGroupedBySender(
  messages: Message[]
): TimestampsBySenderAsKey {
  return messages.reduce<TimestampsBySenderAsKey>((acc, message) => {
    return {
      ...acc,
      [message.sender_name]: [
        ...(acc[message.sender_name] ?? []),
        message.timestamp_ms,
      ],
    };
  }, {});
}

function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString(10).padStart(2, "0");
  const day = date.getDate().toString(10).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function groupSendersByDate(messages: Message[]): DateGroupedMessages {
  return messages.reduce<DateGroupedMessages>((acc, message) => {
    const date = formatDate(message.timestamp);
    return {
      ...acc,
      [date]: [...(acc[date] ?? []), message],
    };
  }, {});
}

function makeLeetDate(timestampMs: number): Date {
  const date = new Date(timestampMs);
  date.setHours(13, 37, 0);
  return date;
}

function countBySenderPairings(
  dateMessageMap: DateGroupedMessages
): CombinationTimestamps[] {
  interface IntermediateMap {
    [id: string]: CombinationTimestamps;
  }

  const values = Object.values(dateMessageMap);
  const intermediate = values.reduce<IntermediateMap>((acc, messages) => {
    const senders = [
      ...new Set(messages.map((message) => message.sender_name)),
    ].sort();
    const id = senders.join(",");
    const timestamp = makeLeetDate(messages[0].timestamp_ms).getTime();
    return {
      ...acc,
      [id]: {
        ...acc[id],
        senders,
        timestamps: [...(acc[id]?.timestamps ?? []), timestamp],
      },
    };
  }, {});

  return Object.values(intermediate).sort(
    (a, b) => a.senders.length - b.senders.length
  );
}

function sortByTimestamp(a: Message, b: Message): number {
  return a.timestamp_ms - b.timestamp_ms;
}

function isDatesSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getAllDatesBetweenTwoDates(start: Date, end: Date): Date[] {
  const dates = [start];

  const currentDate = new Date(start);
  while (!isDatesSameDay(currentDate, end)) {
    currentDate.setDate(currentDate.getDate() + 1);
    dates.push(new Date(currentDate));
  }

  return dates;
}

function getTimings(messages: Message[]): RelativeTimingWithTimestamp[] {
  return messages.reduce<RelativeTimingWithTimestamp[]>((acc, message) => {
    const timing =
      message.timestamp.getSeconds() * 1000 +
      message.timestamp.getMilliseconds();
    return [
      ...acc,
      {
        sender: message.sender_name,
        value: timing,
        timestamp: message.timestamp_ms,
      },
    ];
  }, []);
}

function groupTimingsBySender(
  timings: RelativeTimingWithTimestamp[]
): TimingsGroupedByKey {
  return timings.reduce<TimingsGroupedByKey>(
    (acc, timing) => ({
      ...acc,
      [timing.sender]: [...(acc[timing.sender] ?? []), timing],
    }),
    {}
  );
}

function groupTimingsByDate(
  timings: RelativeTimingWithTimestamp[]
): TimingsGroupedByKey {
  return timings.reduce<TimingsGroupedByKey>((acc, timing) => {
    const date = formatDate(makeLeetDate(timing.timestamp));
    return {
      ...acc,
      [date]: [...(acc[date] ?? []), timing].sort((a, b) => a.value - b.value),
    };
  }, {});
}

function groupTimingsByFirstSender(
  timingsGroupedByDate: TimingsGroupedByKey
): TimingsByFirstSender {
  return Object.entries(timingsGroupedByDate).reduce<TimingsByFirstSender>(
    (acc, [date, timings]) => {
      const firstSender = timings[0].sender;
      return {
        ...acc,
        [firstSender]: {
          ...(acc[firstSender] ?? {}),
          [date]: timings,
        },
      };
    },
    {}
  );
}

function getAverageTimingsAheadOfOthers(
  timingsGroupedByFirstSender: TimingsByFirstSender
): SenderValuePair[] {
  interface IntermediateMap {
    [sender: string]: number[];
  }

  interface IntermediateAverageMap {
    [sender: string]: number;
  }

  const aheadTimesBySender = Object.entries(
    timingsGroupedByFirstSender
  ).reduce<IntermediateMap>((acc, [sender, timings]) => {
    const timingSets = Object.values(timings);
    const aheadTimes = timingSets
      .filter((oneDaysSet) => oneDaysSet.length > 2)
      .map((oneDaysSet) => oneDaysSet[1].value - oneDaysSet[0].value);

    return {
      ...acc,
      [sender]: [...(acc[sender] ?? []), ...aheadTimes],
    };
  }, {});

  const averageTimesBySender = Object.entries(
    aheadTimesBySender
  ).reduce<IntermediateAverageMap>((acc, [sender, aheadTimes]) => {
    return {
      ...acc,
      [sender]:
        aheadTimes.reduce((accTime, time) => accTime + time, 0) /
        aheadTimes.length,
    };
  }, {});

  return Object.entries(averageTimesBySender).reduce<SenderValuePair[]>(
    (acc, [sender, average]) => {
      return [
        ...acc,
        {
          sender,
          value: average,
        },
      ];
    },
    []
  );
}

function countStreak(timestamps: Timestamp[]): number {
  const sorted = [...timestamps].sort((a, b) => a - b);
  let maxStreak = 0;
  sorted.reduce((streak, timestamp, index) => {
    if (index > 0) {
      const lastDatePlusOneDay = makeLeetDate(sorted[index - 1]);
      lastDatePlusOneDay.setDate(lastDatePlusOneDay.getDate() + 1);
      const thisDate = makeLeetDate(timestamp);
      const thisIsNextDate = isDatesSameDay(lastDatePlusOneDay, thisDate);
      if (thisIsNextDate) {
        return streak + 1;
      }

      maxStreak = Math.max(maxStreak, streak);
      return 1;
    }
    return streak;
  }, 1);

  return maxStreak;
}

function reduceByTimestampsToCount(
  timestampsBySender: TimestampsBySenderAsKey
): SenderValueMap {
  return Object.entries(timestampsBySender).reduce<SenderValueMap>(
    (acc, [sender, timestamps]) => ({
      ...acc,
      [sender]: timestamps.length,
    }),
    {}
  );
}

function reduceCombinationsToCount(
  combinations: CombinationTimestamps[]
): MultipleSenderValuePair[] {
  return combinations.map<MultipleSenderValuePair>((combinationTimestamps) => ({
    senders: combinationTimestamps.senders,
    value: combinationTimestamps.timestamps.length,
  }));
}

void (async () => {
  console.log("Analyzing messages");
  const files = await fs.readdir(DATA_INPUT_DIR);

  const loadedFiles = await Promise.all(
    files.map((filename) => loadData<MessageDigest>(filename))
  );

  const messages = timestampMessages(mergeMessages(loadedFiles));

  const leetTimeMessages = messages.filter(isWithinLeet);
  const trueLeetMessages = leetTimeMessages
    .filter(isLeet)
    .sort(sortByTimestamp);
  const total = trueLeetMessages.length;

  const individualTimestamps =
    reduceToTimestampsGroupedBySender(trueLeetMessages);
  const individual = reduceByTimestampsToCount(individualTimestamps);

  const fakeLeetMessages = messages
    .filter(isFakeLeet)
    .filter(isLeet)
    .sort(sortByTimestamp);
  const imposterTimestamps =
    reduceToTimestampsGroupedBySender(fakeLeetMessages);
  const imposters = reduceByTimestampsToCount(imposterTimestamps);

  const trueGroups = groupSendersByDate(trueLeetMessages);

  const totalDays = Object.keys(trueGroups).length;

  const combinationsTimestamps = countBySenderPairings(trueGroups);
  const combinations = reduceCombinationsToCount(combinationsTimestamps);

  const firstMessage = trueLeetMessages[0];
  const first = {
    sender: firstMessage.sender_name,
    timestamp: firstMessage.timestamp_ms,
  };

  const fullGroupCombination = combinationsTimestamps.filter(
    (combination) => combination.senders.length === 3
  )[0];
  const firstGroup = {
    timestamp: fullGroupCombination.timestamps.sort((a, b) => a - b)[0],
  };

  const firstDate = firstMessage.timestamp;
  const lastDate = trueLeetMessages.at(-1).timestamp;
  const allLeetDates = trueLeetMessages
    .map((message) => makeLeetDate(message.timestamp_ms))
    .map((date) => formatDate(date));
  const allDatesBetweenFirstAndLast = getAllDatesBetweenTwoDates(
    firstDate,
    lastDate
  );
  const missedDates = allDatesBetweenFirstAndLast.filter(
    (date) => !allLeetDates.includes(formatDate(date))
  );
  const missedTimestamps = missedDates.map((date) => date.getTime());
  const missed = missedTimestamps.length;

  const timings = getTimings(trueLeetMessages).sort(
    (a, b) => a.value - b.value
  );
  const timingsByDate = groupTimingsByDate(timings);
  const timingsGroupedByFirstSender = groupTimingsByFirstSender(timingsByDate);
  const averageTimeAheadOfOthers = getAverageTimingsAheadOfOthers(
    timingsGroupedByFirstSender
  ).sort((a, b) => a.value - b.value);
  const averageQuickest = averageTimeAheadOfOthers[0];
  const quickest = timings[0];
  const closest = timings.at(-1);

  const streaks = Object.entries(individualTimestamps)
    .map<SenderValuePair>(([sender, timestamps]) => ({
      sender,
      value: countStreak(timestamps),
    }))
    .sort((a, b) => a.value - b.value);

  const longestStreak = streaks.at(-1);

  const output: Output = {
    individual,
    total,
    totalDays,
    imposters,
    combinations,
    first,
    firstGroup,
    missed,
    averageQuickest,
    quickest,
    closest,
    longestStreak,
  };

  const outPath = path.join(DATA_OUTPUT_DIR, "output.json");
  await fs.writeFile(outPath, JSON.stringify(output, null, 2));
  console.log("output done", outPath);
})();
