import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, onClick, clickable = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient animate-fade-in text-left ${
        clickable ? 'transition-all hover:shadow-ambient-lg hover:-translate-y-0.5 cursor-pointer' : 'cursor-default'
      }`}
      data-testid="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-heading font-bold text-on-surface font-mono">{value}</h3>
        </div>
        {Icon && (
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-sm font-body text-muted-foreground">{subtitle}</p>
      )}
      {trend && (
        <div className={`text-sm font-mono mt-2 ${trend > 0 ? 'text-success' : 'text-error'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </button>
  );
};

export default StatCard;
