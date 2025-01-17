export function aggregateData(records: any[], key: string) {
  const summary = records.reduce((acc, record) => {
    const value = record[key];
    const existing = acc.find((item) => item[key] === value);
    if (existing) {
      existing.totalAmount += record.amount;
      existing.count += 1;
    } else {
      acc.push({ [key]: value, totalAmount: record.amount, count: 1 });
    }
    return acc;
  }, []);
  return summary;
}
