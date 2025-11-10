import React from 'react';

export interface DashboardNavProps {
  items: string[];
  selected: number;
  onSelect: (idx: number) => void;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  items,
  selected,
  onSelect,
}) => (
  <nav style={{ minWidth: 220, borderRight: '1px solid #ccc', padding: 24 }}>
    <h2>Experiments</h2>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((name, idx) => (
        <li key={name} style={{ margin: '12px 0' }}>
          <button
            style={{
              background: idx === selected ? '#eef' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontWeight: idx === selected ? 'bold' : 'normal',
            }}
            onClick={() => onSelect(idx)}
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
