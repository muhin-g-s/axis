import type { Timestamp } from "./primitives";

export const getUnixTimestampNow = (): Timestamp => Math.floor(Date.now() / 1000) as Timestamp;
