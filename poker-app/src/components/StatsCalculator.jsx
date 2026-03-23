import { useState } from 'react';
import './StatsCalculator.css';

// Hand strength ranking
const HAND_RANKINGS = [
  { rank: 1, name: '로얄 플러쉬', nameEn: 'Royal Flush', probability: '0.000154%', combos: 4, description: 'A K Q J T 동일 수트', color: '#ffd700' },
  { rank: 2, name: '스트레이트 플러쉬', nameEn: 'Straight Flush', probability: '0.00139%', combos: 36, description: '5장 연속 동일 수트', color: '#ff6b6b' },
  { rank: 3, name: '포 오브 어 카인드', nameEn: 'Four of a Kind', probability: '0.0240%', combos: 624, description: '같은 랭크 4장', color: '#ff9f43' },
  { rank: 4, name: '풀 하우스', nameEn: 'Full House', probability: '0.1441%', combos: 3744, description: '트리플 + 원 페어', color: '#ee5a24' },
  { rank: 5, name: '플러쉬', nameEn: 'Flush', probability: '0.1965%', combos: 5108, description: '같은 수트 5장', color: '#6c5ce7' },
  { rank: 6, name: '스트레이트', nameEn: 'Straight', probability: '0.3532%', combos: 10200, description: '연속된 5장', color: '#0984e3' },
  { rank: 7, name: '트리플', nameEn: 'Three of a Kind', probability: '2.1128%', combos: 54912, description: '같은 랭크 3장', color: '#00b894' },
  { rank: 8, name: '투 페어', nameEn: 'Two Pair', probability: '4.7539%', combos: 123552, description: '두 쌍의 페어', color: '#00cec9' },
  { rank: 9, name: '원 페어', nameEn: 'One Pair', probability: '42.2569%', combos: 1098240, description: '같은 랭크 2장', color: '#74b9ff' },
  { rank: 10, name: '하이 카드', nameEn: 'High Card', probability: '50.1177%', combos: 1302540, description: '아무 패턴 없음', color: '#b2bec3' },
];

// Pot odds calculator
function calcPotOdds(potSize, callAmount) {
  if (!callAmount || callAmount <= 0) return null;
  const totalPot = potSize + callAmount;
  const odds = (callAmount / totalPot) * 100;
  return odds;
}

// Equity needed to break even
function calcBreakEvenEquity(callAmount, potSize) {
  if (!callAmount || callAmount <= 0) return null;
  return (callAmount / (potSize + callAmount)) * 100;
}

// Outs to equity (rule of 4 and 2)
function outsToEquity(outs, streets) {
  if (streets === 2) return Math.min(outs * 4, 100); // to river
  return Math.min(outs * 2, 100); // one street
}

// SPR (Stack to Pot Ratio)
function calcSPR(effectiveStack, potSize) {
  if (!potSize || potSize <= 0) return null;
  return (effectiveStack / potSize).toFixed(2);
}

const COMMON_DRAWS = [
  { name: '플러쉬 드로우', outs: 9, description: '4장 같은 수트' },
  { name: '오픈 엔디드 스트레이트 드로우', outs: 8, description: '양쪽이 열린 스트레이트 드로우' },
  { name: '거트샷 스트레이트 드로우', outs: 4, description: '중간이 빠진 스트레이트 드로우' },
  { name: '플러쉬 드로우 + 오버카드', outs: 12, description: '플러쉬 드로우 + 탑페어 드로우' },
  { name: '오픈엔디드 + 플러쉬 드로우', outs: 15, description: '가장 강력한 드로우' },
  { name: '인사이드 + 플러쉬 드로우', outs: 12, description: '거트샷 + 플러쉬' },
  { name: '오버카드 2장', outs: 6, description: '탑페어 기대 오버카드' },
  { name: '오버카드 1장', outs: 3, description: '단일 오버카드' },
];

export default function StatsCalculator() {
  const [activeTab, setActiveTab] = useState('potodds');

  // Pot Odds state
  const [potSize, setPotSize] = useState('');
  const [callAmount, setCallAmount] = useState('');
  const [heroEquity, setHeroEquity] = useState('');

  // Outs state
  const [outs, setOuts] = useState('');
  const [streets, setStreets] = useState('1');
  const [selectedDraw, setSelectedDraw] = useState(null);

  // SPR state
  const [stack, setStack] = useState('');
  const [pot, setPot] = useState('');

  const potOdds = calcPotOdds(Number(potSize), Number(callAmount));
  const breakEven = calcBreakEvenEquity(Number(callAmount), Number(potSize));
  const isCallProfitable = heroEquity && potOdds ? Number(heroEquity) > breakEven : null;

  const outsEquityTurn = outs ? outsToEquity(Number(outs), 1) : null;
  const outsEquityRiver = outs ? outsToEquity(Number(outs), 2) : null;

  const spr = stack && pot ? calcSPR(Number(stack), Number(pot)) : null;
  const sprAnalysis = spr ? (
    spr < 3 ? '낮은 SPR: 올인 위주 전략. 강한 드로우/원페어도 올인 가능' :
    spr < 7 ? '중간 SPR: 포스트플랍 스택 관리 중요. 탑페어+ 공격적으로' :
    '높은 SPR: 딥 스택. 강한 핸드(투페어+) 위주 빌드업'
  ) : null;

  function selectDraw(draw) {
    setSelectedDraw(draw);
    setOuts(String(draw.outs));
  }

  return (
    <div className="stats-calculator">
      <h2>승률 & 통계 계산기</h2>
      <p className="subtitle">팟 오즈, 아웃츠, SPR을 빠르게 계산하세요</p>

      <div className="calc-tabs">
        {[
          { id: 'potodds', label: '팟 오즈' },
          { id: 'outs', label: '아웃츠 계산' },
          { id: 'spr', label: 'SPR 계산기' },
          { id: 'hands', label: '핸드 랭킹' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`calc-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pot Odds Calculator */}
      {activeTab === 'potodds' && (
        <div className="calc-panel">
          <h3 className="panel-title">팟 오즈 계산기</h3>
          <p className="panel-desc">콜이 수익적인지 계산합니다</p>
          <div className="input-grid">
            <div className="input-group">
              <label>현재 팟 크기</label>
              <input
                type="number"
                placeholder="예: 100"
                value={potSize}
                onChange={e => setPotSize(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>콜 금액</label>
              <input
                type="number"
                placeholder="예: 50"
                value={callAmount}
                onChange={e => setCallAmount(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>내 에쿼티 (%)</label>
              <input
                type="number"
                placeholder="예: 35"
                value={heroEquity}
                onChange={e => setHeroEquity(e.target.value)}
              />
            </div>
          </div>

          {potOdds !== null && (
            <div className="calc-results">
              <div className="result-card">
                <div className="result-label">팟 오즈</div>
                <div className="result-value">{potOdds.toFixed(1)}%</div>
                <div className="result-detail">
                  {callAmount} : {Number(potSize) + Number(callAmount)} ({(Number(callAmount) / Number(potSize)).toFixed(2)} : 1)
                </div>
              </div>
              <div className="result-card">
                <div className="result-label">손익분기 에쿼티</div>
                <div className="result-value">{breakEven?.toFixed(1)}%</div>
                <div className="result-detail">이 이상의 에쿼티가 있어야 콜이 수익적</div>
              </div>
              {heroEquity && (
                <div className={`result-card decision ${isCallProfitable ? 'profitable' : 'unprofitable'}`}>
                  <div className="result-label">결정</div>
                  <div className="result-value decision-text">
                    {isCallProfitable ? '✓ 콜 수익적' : '✗ 콜 비수익적'}
                  </div>
                  <div className="result-detail">
                    내 에쿼티 {heroEquity}% {isCallProfitable ? '>' : '<'} 손익분기 {breakEven?.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="formula-box">
            <h4>계산 공식</h4>
            <code>팟 오즈 = 콜금액 / (팟 + 콜금액) × 100</code>
            <code>손익분기 에쿼티 = 팟 오즈 (%)와 동일</code>
          </div>
        </div>
      )}

      {/* Outs Calculator */}
      {activeTab === 'outs' && (
        <div className="calc-panel">
          <h3 className="panel-title">아웃츠 계산기</h3>
          <p className="panel-desc">룰 오브 4/2로 드로우 완성 확률을 계산합니다</p>

          <div className="draws-grid">
            {COMMON_DRAWS.map(draw => (
              <button
                key={draw.name}
                className={`draw-btn ${selectedDraw?.name === draw.name ? 'selected' : ''}`}
                onClick={() => selectDraw(draw)}
              >
                <span className="draw-outs">{draw.outs} outs</span>
                <span className="draw-name">{draw.name}</span>
                <span className="draw-desc">{draw.description}</span>
              </button>
            ))}
          </div>

          <div className="input-group outs-input">
            <label>아웃츠 직접 입력</label>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="1~20"
              value={outs}
              onChange={e => { setOuts(e.target.value); setSelectedDraw(null); }}
            />
          </div>

          {outs && (
            <div className="calc-results">
              <div className="result-card">
                <div className="result-label">턴 한 장 남았을 때</div>
                <div className="result-value">{outsEquityTurn?.toFixed(1)}%</div>
                <div className="result-detail">룰 오브 2: {outs} × 2</div>
              </div>
              <div className="result-card">
                <div className="result-label">플랍에서 (턴+리버 2장)</div>
                <div className="result-value">{outsEquityRiver?.toFixed(1)}%</div>
                <div className="result-detail">룰 오브 4: {outs} × 4</div>
              </div>
              <div className="result-card">
                <div className="result-label">스트리트 선택</div>
                <div className="streets-toggle">
                  <button className={streets === '1' ? 'active' : ''} onClick={() => setStreets('1')}>1 스트리트</button>
                  <button className={streets === '2' ? 'active' : ''} onClick={() => setStreets('2')}>2 스트리트</button>
                </div>
                <div className="result-value">{outsToEquity(Number(outs), Number(streets)).toFixed(1)}%</div>
              </div>
            </div>
          )}

          <div className="formula-box">
            <h4>룰 오브 4와 2</h4>
            <code>1 스트리트 남음: 아웃츠 × 2 ≈ 에쿼티(%)</code>
            <code>2 스트리트 남음: 아웃츠 × 4 ≈ 에쿼티(%)</code>
          </div>
        </div>
      )}

      {/* SPR Calculator */}
      {activeTab === 'spr' && (
        <div className="calc-panel">
          <h3 className="panel-title">SPR 계산기</h3>
          <p className="panel-desc">Stack-to-Pot Ratio로 포스트플랍 전략을 결정합니다</p>
          <div className="input-grid">
            <div className="input-group">
              <label>유효 스택 (Effective Stack)</label>
              <input
                type="number"
                placeholder="예: 500"
                value={stack}
                onChange={e => setStack(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>플랍 팟 크기</label>
              <input
                type="number"
                placeholder="예: 100"
                value={pot}
                onChange={e => setPot(e.target.value)}
              />
            </div>
          </div>

          {spr !== null && (
            <div className="calc-results">
              <div className="result-card highlight">
                <div className="result-label">SPR</div>
                <div className="result-value spr-value">{spr}</div>
                <div className="result-detail">
                  {spr < 3 ? '낮음 (< 3)' : spr < 7 ? '중간 (3~7)' : '높음 (> 7)'}
                </div>
              </div>
              <div className="result-card analysis">
                <div className="result-label">전략 분석</div>
                <div className="result-text">{sprAnalysis}</div>
              </div>
            </div>
          )}

          <div className="spr-guide">
            <h4>SPR 가이드</h4>
            <div className="spr-table">
              <div className="spr-row header">
                <span>SPR 범위</span>
                <span>분류</span>
                <span>전략 요점</span>
              </div>
              {[
                { range: '< 3', type: '낮음', strategy: '원페어도 스택오프. 올인 빈도 높음' },
                { range: '3 ~ 7', type: '중간', strategy: '탑투페어+ 로 스택오프 고려' },
                { range: '7 ~ 13', type: '높음', strategy: '세트/스트레이트+ 위주 스택오프' },
                { range: '> 13', type: '매우 높음', strategy: '너츠 핸드 위주. 포스트플랍 스킬 중요' },
              ].map(row => (
                <div key={row.range} className="spr-row">
                  <span className="spr-range">{row.range}</span>
                  <span className="spr-type">{row.type}</span>
                  <span className="spr-strategy">{row.strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hand Rankings */}
      {activeTab === 'hands' && (
        <div className="calc-panel">
          <h3 className="panel-title">핸드 랭킹</h3>
          <p className="panel-desc">5카드 포커 핸드 확률표</p>
          <div className="hands-table">
            {HAND_RANKINGS.map(hand => (
              <div key={hand.rank} className="hand-row">
                <div className="hand-rank" style={{ color: hand.color }}>#{hand.rank}</div>
                <div className="hand-info">
                  <div className="hand-name" style={{ color: hand.color }}>{hand.name}</div>
                  <div className="hand-name-en">{hand.nameEn}</div>
                  <div className="hand-desc">{hand.description}</div>
                </div>
                <div className="hand-stats">
                  <div className="hand-combos">{hand.combos.toLocaleString()} 콤보</div>
                  <div className="hand-prob">{hand.probability}</div>
                </div>
                <div className="hand-bar-container">
                  <div
                    className="hand-bar"
                    style={{
                      width: `${Math.log10(hand.combos + 1) / Math.log10(1302540) * 100}%`,
                      background: hand.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
