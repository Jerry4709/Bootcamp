import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

export interface ChartPoint {
  label: string;
  value: number;
}

interface Props {
  data: ChartPoint[];
  loading?: boolean;
  color?: string;
}

export const ActivitySummaryChart = ({
  data,
  loading = false,
  color = '#7C3AED', // violet-600
}: Props) => {
  const gradientId = `gradient-${color.replace('#', '')}`;

  /* ---------- skeleton while loading ---------- */
  if (loading)
    return (
      <div className="w-full h-[320px] rounded-2xl bg-white/70 dark:bg-neutral-800/70 shadow-lg p-6 overflow-hidden">
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-700 dark:to-neutral-800 rounded-lg" />
      </div>
    );

  /* ---------- actual chart ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full h-[320px] rounded-2xl bg-white/70 dark:bg-neutral-800/70 shadow-lg p-6"
    >
      <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
        สถิติภาพรวม
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-neutral-200 dark:stroke-neutral-700"
          />
          <XAxis
            dataKey="label"
            className="text-xs fill-neutral-500 dark:fill-neutral-400"
          />
          <YAxis
            className="text-xs fill-neutral-500 dark:fill-neutral-400"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ background: '#1e293b', borderRadius: '0.5rem' }}
            labelClassName="text-violet-400"
            itemStyle={{ color: '#e2e8f0' }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.7} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={3}
            animationDuration={800} // ⏳ animate on mount
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
