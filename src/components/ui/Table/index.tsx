import React from 'react';

export interface Column<T> {
  title: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  isLoading,
  className = '',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-neutral-900 rounded-lg">
        <div className="text-neutral-500 dark:text-neutral-400">กำลังโหลด...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-neutral-900 rounded-lg">
        <div className="text-neutral-500 dark:text-neutral-400">ไม่พบข้อมูล</div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider text-left"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-neutral-300 text-sm"
                >
                  {col.render ? col.render(row) : (row[col.key] as unknown as string | number | boolean | React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
