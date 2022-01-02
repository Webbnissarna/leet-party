type Timestamp = number;
export type SenderValueMap = Record<string, number>;

interface MultipleSenderValuePair {
  senders: string[];
  value: number;
}

interface SenderValuePair {
  sender: string;
  value: number;
}

interface RelativeTimingWithTimestamp extends SenderValuePair {
  timestamp: number;
}

export interface Output {
  individual: SenderValueMap;
  total: number;
  totalDays: number;
  imposters: SenderValueMap;
  combinations: MultipleSenderValuePair[];
  first: {
    sender: string;
    timestamp: Timestamp;
  };
  firstGroup: {
    timestamp: Timestamp;
  };
  missed: number;
  averageQuickest: SenderValuePair;
  quickest: RelativeTimingWithTimestamp;
  closest: RelativeTimingWithTimestamp;
  longestStreak: SenderValuePair;
}
