import React from 'react';
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  width?: string;
  children?: React.ReactNode;
}
const StatCard = ({
  title,
  value,
  subtitle,
  width = 'full',
  children
}: StatCardProps) => {
  return <div className={`bg-white p-4 rounded shadow w-${width}`}>
      <h3 className="text-emerald-500 uppercase font-medium">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {children ? children : <div className="mt-2">
          <p className="text-4xl text-gray-800">{value}</p>
        </div>}
    </div>;
};
export default StatCard;