import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, onClick, clickable = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-white rounded-2xl p-6 border border-[#eee] text-left animate-fade-in ${
        clickable
          ? 'transition-all hover:shadow-ambient-lg hover:-translate-y-0.5 cursor-pointer'
          : 'cursor-default'
      }`}
      data-testid="stat-card"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-[#aaa] uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#eef1ff]">
            <Icon className="w-5 h-5 text-[#0028aa]" />
          </div>
        )}
      </div>
      <h3 className="text-3xl font-heading font-bold text-[#1b1c19] mb-1">{value}</h3>
      {subtitle && (
        <p className="text-sm text-[#888]">{subtitle}</p>
      )}
      {trend && (
        <div className={`text-xs font-semibold mt-2 ${trend > 0 ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </button>
  );
};

export default StatCard;
