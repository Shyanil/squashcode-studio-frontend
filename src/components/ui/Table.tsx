import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface TableColumn<T> {
  className?: string;
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Array<TableColumn<T>>;
  data: T[];
  emptyMessage?: string;
}

function getCellValue<T>(item: T, key: string) {
  return String((item as Record<string, unknown>)[key] ?? '');
}

export function Table<T>({ columns, data, emptyMessage = 'No records yet.' }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th className={cn('px-4 py-3', column.className)} key={column.key} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr className="text-slate-700 dark:text-slate-200" key={rowIndex}>
                  {columns.map((column) => (
                    <td className={cn('px-4 py-3', column.className)} key={column.key}>
                      {column.render ? column.render(item) : getCellValue(item, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

