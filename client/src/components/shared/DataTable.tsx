'use client';

import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  pagination,
}: DataTableProps<T>) {
  return (
    <div
      className={`w-full bg-surface-card flex flex-col rounded-2xl border border-border-subtle shadow-sm ${className}`}
    >
      <div className="w-full overflow-x-auto min-h-[260px] flex-1 custom-scrollbar">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead className="border-b border-border-subtle bg-surface-container-low text-xs font-bold uppercase tracking-wider text-on-surface-variant sticky top-0 z-10">
            <tr>
              {columns.map((column, idx) => (
                <th key={idx} className={`px-6 py-4 ${column.className || ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                    <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-20 text-center text-on-surface-variant"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-base font-medium">
                      {emptyMessage}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="transition-colors duration-200 hover:bg-surface-container-low group"
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={`whitespace-nowrap px-6 py-4 ${column.className || ''}`}
                    >
                      {column.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-subtle bg-surface-container-lowest px-6 py-4 shrink-0">
          <span className="text-xs font-medium text-on-surface-variant">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="border-border-subtle bg-surface-card hover:bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary h-9 px-3"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="border-border-subtle bg-surface-card hover:bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary h-9 px-3"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
