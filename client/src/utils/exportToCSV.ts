export function exportToCSV(
  data: any[],
  filename: string,
  columns?: { key: string; label: string }[]
) {
  if (!data || data.length === 0) return;

  const extractKeys = columns
    ? columns.map((c) => c.key)
    : Object.keys(data[0]);
  const extractLabels = columns
    ? columns.map((c) => c.label)
    : Object.keys(data[0]);

  const csvRows = [];
  // Add header
  csvRows.push(extractLabels.join(','));

  // Add rows
  for (const row of data) {
    const values = extractKeys.map((key) => {
      const keys = key.split('.');
      let val = row;
      for (const k of keys) {
        if (val === undefined || val === null) break;
        val = val[k];
      }

      if (val === undefined || val === null) {
        return '""';
      }

      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
