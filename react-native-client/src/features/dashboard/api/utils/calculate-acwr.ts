import { addDays, differenceInDays, format, startOfDay, subDays } from 'date-fns';

export interface DailySetCount {
  date: string; // YYYY-MM-DD
  totalSets: number;
}

export interface ACWRDataPoint {
  date: string;
  acuteLoad: number; // 7-day average
  chronicLoad: number; // 28-day average
  ratio: number; // acute / chronic
  isCalibrating: boolean; // true if this date is < 28 days from the user's first ever log
}

/**
 * Calculates the Acute:Chronic Workload Ratio time series based on daily set volumes.
 * 
 * @param dailyLogs - Sparse array of logs grouped by date (YYYY-MM-DD)
 * @param targetStartDate - The first date to include in the UI chart output
 * @param targetEndDate - The last date to include in the UI chart output
 * @param firstEverLogDate - The date of the user's very first log (used to determine calibration state)
 */
export function generateACWRTimeSeries(
  dailyLogs: DailySetCount[],
  targetStartDate: Date,
  targetEndDate: Date,
  firstEverLogDate: Date | null
): ACWRDataPoint[] {
  const logMap = new Map<string, number>();
  for (const log of dailyLogs) {
    logMap.set(log.date, log.totalSets);
  }

  const calculationStartDate = subDays(targetStartDate, 27);

  const window7: number[] = [];
  const window28: number[] = [];

  const results: ACWRDataPoint[] = [];

  const average = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const totalDaysToProcess = differenceInDays(targetEndDate, calculationStartDate) + 1;

  for (let i = 0; i < totalDaysToProcess; i++) {
    const currentDate = addDays(calculationStartDate, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    const setsToday = logMap.get(dateStr) ?? 0;

    window7.push(setsToday);
    window28.push(setsToday);

    if (window7.length > 7) window7.shift();
    if (window28.length > 28) window28.shift();

    if (i >= 27) {
      const acuteLoad = average(window7);
      const chronicLoad = average(window28);

      const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

      let isCalibrating = true;
      if (firstEverLogDate) {
        const daysSinceFirstLog = differenceInDays(currentDate, startOfDay(firstEverLogDate));
        isCalibrating = daysSinceFirstLog < 28;
      }

      results.push({
        date: dateStr,
        acuteLoad: Number(acuteLoad.toFixed(2)),
        chronicLoad: Number(chronicLoad.toFixed(2)),
        ratio: Number(ratio.toFixed(2)),
        isCalibrating,
      });
    }
  }

  return results;
}
