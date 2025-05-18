import React from 'react';

// เพิ่ม prop imageKey เพื่อบอกว่าคอลัมน์ไหนคือรูป
export interface Column<T> {
  title: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
  image?: boolean;
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
  /* ---------------------------- Loading state --------------------------- */
  if (isLoading)
    return (
      <div className="flex items-center justify-center p-10 bg-white dark:bg-neutral-900 rounded-3xl shadow-lg">
        <div className="flex gap-2 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full bg-violet-500 animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );

  /* --------------------------- Empty state ------------------------------ */
  if (!data.length)
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-neutral-900 rounded-3xl shadow-lg space-y-2">
        <span className="text-5xl">🗂️</span>
        <p className="text-neutral-500 dark:text-neutral-400">ไม่พบข้อมูลกิจกรรม</p>
      </div>
    );

  /* ---------------------------- Helpers --------------------------------- */
  const getCol = (k: keyof T | string) => columns.find((c) => c.key === k);
  const imgCol = columns.find((c) => c.image);
  const colorDot = (cat: string) =>
    ({
      อาสา: 'bg-violet-500',
      ช่วยงาน: 'bg-emerald-500',
      อบรม: 'bg-amber-500',
    }[cat] || 'bg-neutral-400');

  /* ---------------------------- Card view (≤ md) ------------------------ */
  const CardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((item, idx) => (
        <article
          key={idx}
          onClick={() => onRowClick?.(item)}
          className={`group overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 shadow-lg transition
            hover:shadow-xl hover:-translate-y-1 ${onRowClick && 'cursor-pointer'} `}
        >
          {/* image */}
          <div className="aspect-video bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
            {imgCol?.render ? (
              imgCol.render(item)
            ) : (
              <div className="h-full flex items-center justify-center text-4xl text-neutral-300">📷</div>
            )}
          </div>

          {/* body */}
          <div className="p-6 space-y-3">
            {/* title */}
            {getCol('title') && (
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
                {String(item[getCol('title')!.key])}
              </h3>
            )}

            {/* category + date */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  getCol('category')
                    ? colorDot(String(item[getCol('category')!.key]))
                    : 'bg-neutral-400'
                }`} />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {getCol('category') ? String(item[getCol('category')!.key]) : ''}
                </span>
              </div>
              {getCol('start_time') && (
                <time className="text-neutral-500 dark:text-neutral-400">
                  {new Date(String(item[getCol('start_time')!.key]) ).toLocaleDateString('th-TH')}
                </time>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  /* ---------------------------- Table view (≥ md) ----------------------- */
  const TableView = () => (
    <div className="overflow-auto rounded-3xl shadow-lg">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr
              key={rIdx}
              onClick={() => onRowClick?.(row)}
              className={`
                group bg-white dark:bg-neutral-800/60 backdrop-blur-xl
                transition hover:bg-violet-50/50 dark:hover:bg-violet-500/10
                ${onRowClick && 'cursor-pointer'}`}
              style={{ borderRadius: '1.25rem' }}
            >
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="px-6 py-4 first:rounded-l-2xl last:rounded-r-2xl">
                  {col.render ? (
                    col.render(row)
                  ) : col.key === 'category' ? (
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorDot(String(row[col.key]))}`} />
                      <span>{String(row[col.key])}</span>
                    </div>
                  ) : col.key === 'start_time' || col.key === 'end_time' ? (
                    new Date(String(row[col.key])).toLocaleDateString('th-TH')
                  ) : (
                    String(row[col.key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ---------------------------- Render ---------------------------------- */
  return (
    <section className={`space-y-4 ${className}`}>
      {/* mobile / tablet */}
      <div className="block md:hidden">
        <CardView />
      </div>
      {/* desktop */}
      <div className="hidden md:block">
        <TableView />
      </div>
    </section>
  );
}
