import { useState } from 'react';
import './HandRangeChart.css';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// Default opening ranges by position (simplified GTO ranges)
const DEFAULT_RANGES = {
  UTG: [
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AQs','AJs','ATs','A9s',
    'KQs','KJs','KTs',
    'QJs','QTs',
    'JTs',
    'AKo','AQo','AJo',
    'KQo',
  ],
  'UTG+1': [
    'AA','KK','QQ','JJ','TT','99','88','77',
    'AKs','AQs','AJs','ATs','A9s','A8s',
    'KQs','KJs','KTs','K9s',
    'QJs','QTs','Q9s',
    'JTs','J9s',
    'T9s',
    'AKo','AQo','AJo','ATo',
    'KQo','KJo',
  ],
  MP: [
    'AA','KK','QQ','JJ','TT','99','88','77','66',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s',
    'KQs','KJs','KTs','K9s',
    'QJs','QTs','Q9s',
    'JTs','J9s',
    'T9s','T8s',
    '98s',
    'AKo','AQo','AJo','ATo',
    'KQo','KJo','KTo',
    'QJo',
  ],
  HJ: [
    'AA','KK','QQ','JJ','TT','99','88','77','66','55',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s',
    'KQs','KJs','KTs','K9s','K8s',
    'QJs','QTs','Q9s','Q8s',
    'JTs','J9s','J8s',
    'T9s','T8s',
    '98s','97s',
    '87s',
    'AKo','AQo','AJo','ATo',
    'KQo','KJo','KTo',
    'QJo','QTo',
    'JTo',
  ],
  CO: [
    'AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'KQs','KJs','KTs','K9s','K8s','K7s',
    'QJs','QTs','Q9s','Q8s','Q7s',
    'JTs','J9s','J8s','J7s',
    'T9s','T8s','T7s',
    '98s','97s','96s',
    '87s','86s',
    '76s','75s',
    '65s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQo','KJo','KTo','K9o',
    'QJo','QTo','Q9o',
    'JTo','J9o',
    'T9o',
  ],
  BTN: [
    'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
    'QJs','QTs','Q9s','Q8s','Q7s','Q6s',
    'JTs','J9s','J8s','J7s','J6s',
    'T9s','T8s','T7s','T6s',
    '98s','97s','96s','95s',
    '87s','86s','85s',
    '76s','75s','74s',
    '65s','64s',
    '54s','53s',
    '43s',
    'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o',
    'KQo','KJo','KTo','K9o','K8o',
    'QJo','QTo','Q9o','Q8o',
    'JTo','J9o','J8o',
    'T9o','T8o',
    '98o','97o',
    '87o',
    '76o',
  ],
  SB: [
    'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s',
    'QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s',
    'JTs','J9s','J8s','J7s','J6s','J5s',
    'T9s','T8s','T7s','T6s','T5s',
    '98s','97s','96s','95s','94s',
    '87s','86s','85s','84s',
    '76s','75s','74s',
    '65s','64s','63s',
    '54s','53s','52s',
    '43s','42s',
    '32s',
    'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o',
    'KQo','KJo','KTo','K9o','K8o','K7o',
    'QJo','QTo','Q9o','Q8o','Q7o',
    'JTo','J9o','J8o','J7o',
    'T9o','T8o','T7o',
    '98o','97o','96o',
    '87o','86o',
    '76o','75o',
    '65o',
    '54o',
  ],
  BB: [], // BB defends vs different positions - simplified
};

function getHandKey(row, col) {
  const r = RANKS[row];
  const c = RANKS[col];
  if (row === col) return r + r; // pair
  if (row < col) return r + c + 's'; // suited (upper triangle)
  return c + r + 'o'; // offsuit (lower triangle)
}

function getCellColor(hand, selectedRange) {
  if (!selectedRange || selectedRange.length === 0) return '';
  if (selectedRange.includes(hand)) return 'in-range';
  return '';
}

export default function HandRangeChart() {
  const [selectedPosition, setSelectedPosition] = useState('BTN');
  const [customRange, setCustomRange] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRange, setEditedRange] = useState(new Set());

  const currentRange = customRange || DEFAULT_RANGES[selectedPosition] || [];

  function handlePositionChange(pos) {
    setSelectedPosition(pos);
    setCustomRange(null);
    setIsEditing(false);
    setEditedRange(new Set());
  }

  function toggleEdit() {
    if (!isEditing) {
      setEditedRange(new Set(currentRange));
    } else {
      setCustomRange([...editedRange]);
    }
    setIsEditing(!isEditing);
  }

  function toggleCell(hand) {
    if (!isEditing) return;
    setEditedRange(prev => {
      const next = new Set(prev);
      if (next.has(hand)) next.delete(hand);
      else next.add(hand);
      return next;
    });
  }

  function resetRange() {
    setCustomRange(null);
    setIsEditing(false);
    setEditedRange(new Set());
  }

  const activeRange = isEditing ? editedRange : new Set(currentRange);
  const rangeCount = activeRange.size;

  // Calculate combos
  const combos = [...activeRange].reduce((acc, hand) => {
    if (hand.length === 2) return acc + 6; // pair: 6 combos
    if (hand.endsWith('s')) return acc + 4; // suited: 4 combos
    return acc + 12; // offsuit: 12 combos
  }, 0);

  return (
    <div className="hand-range-chart">
      <h2>핸드 레인지 차트</h2>
      <p className="subtitle">포지션별 오프닝 레인지를 확인하고 커스텀 레인지를 만들어보세요</p>

      <div className="position-selector">
        {POSITIONS.map(pos => (
          <button
            key={pos}
            className={`pos-btn ${selectedPosition === pos ? 'active' : ''}`}
            onClick={() => handlePositionChange(pos)}
          >
            {pos}
          </button>
        ))}
      </div>

      <div className="range-stats">
        <span className="stat"><strong>{rangeCount}</strong> 핸드</span>
        <span className="stat"><strong>{combos}</strong> 콤보</span>
        <span className="stat"><strong>{((combos / 1326) * 100).toFixed(1)}%</strong> of hands</span>
      </div>

      <div className="chart-container">
        <div className="chart-grid">
          {RANKS.map((_, row) =>
            RANKS.map((_, col) => {
              const hand = getHandKey(row, col);
              const inRange = activeRange.has(hand);
              const isPair = row === col;
              const isSuited = row < col;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${inRange ? 'in-range' : ''} ${isPair ? 'pair' : ''} ${isSuited ? 'suited' : 'offsuit'} ${isEditing ? 'editable' : ''}`}
                  onClick={() => toggleCell(hand)}
                  title={hand}
                >
                  <span className="hand-label">{hand}</span>
                </div>
              );
            })
          )}
        </div>
        <div className="chart-legend">
          <span className="legend-item pair-legend">페어</span>
          <span className="legend-item suited-legend">수티드</span>
          <span className="legend-item offsuit-legend">오프수트</span>
          <span className="legend-item in-range-legend">레인지 포함</span>
        </div>
      </div>

      <div className="chart-actions">
        <button className={`action-btn ${isEditing ? 'save-btn' : 'edit-btn'}`} onClick={toggleEdit}>
          {isEditing ? '저장' : '편집'}
        </button>
        {(customRange || isEditing) && (
          <button className="action-btn reset-btn" onClick={resetRange}>초기화</button>
        )}
      </div>
    </div>
  );
}
