export const StatCard = ({ title, value, icon, color = 'primary' }: any) => {
  return (
    <div className={`card`} style={{ borderLeft: `4px solid var(--${color})` }}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-muted text-sm uppercase tracking-wider mb-1 font-bold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div style={{ color: `var(--${color})` }}>
          {icon}
        </div>
      </div>
    </div>
  );
};
