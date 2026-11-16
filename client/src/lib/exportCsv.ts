export function exportToCsv<T>(
  filename: string,
  data: T[],
  columns: {
    header: string;
    accessor: (item: T) => string | number | boolean;
  }[]
) {
  if (!data || !data.length) return;

  const csvRows = [];

  // Headers
  const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`);
  csvRows.push(headers.join(','));

  // Rows
  for (const row of data) {
    const values = columns.map((col) => {
      const val = col.accessor(row);
      const stringVal = val === null || val === undefined ? '' : String(val);
      // Escape quotes
      return `"${stringVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob and trigger download
  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
