import { useState } from 'react';
import HandRangeChart from './components/HandRangeChart';
import StrategyTips from './components/StrategyTips';
import StatsCalculator from './components/StatsCalculator';
import './App.css';

const NAV_ITEMS = [
  { id: 'range', label: '핸드 레인지', icon: '♠' },
  { id: 'strategy', label: '전략 & 팁', icon: '♣' },
  { id: 'stats', label: '통계 계산기', icon: '♥' },
];

export default function App() {
  const [activePage, setActivePage] = useState('range');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">♠</span>
          <span className="brand-name">Poker Curation</span>
        </div>
        <nav className="header-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {activePage === 'range' && <HandRangeChart />}
        {activePage === 'strategy' && <StrategyTips />}
        {activePage === 'stats' && <StatsCalculator />}
      </main>

      <footer className="app-footer">
        <span>Poker Curation App &copy; 2024 &mdash; GTO 기반 학습 도구</span>
      </footer>
    </div>
  );
}
