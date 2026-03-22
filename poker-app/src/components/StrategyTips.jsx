import { useState } from 'react';
import './StrategyTips.css';

const CATEGORIES = ['전체', '프리플랍', '포스트플랍', '포지션', '블러핑', '밸류벳', '토너먼트', '심리전'];

const TIPS = [
  {
    id: 1,
    category: '프리플랍',
    title: '포지션이 곧 파워다',
    difficulty: '기초',
    summary: '딜러 버튼에 가까울수록 더 많은 핸드를 플레이하라',
    content: `포지션은 포커에서 가장 중요한 요소 중 하나입니다. 레이트 포지션(CO, BTN)에서는 모든 상대방의 행동을 먼저 보고 결정할 수 있어 강력한 이점이 있습니다.

**BTN(버튼)의 장점:**
- 포스트플랍에서 항상 마지막으로 액션
- 블러프 기회 증가
- 팟 컨트롤 용이
- 더 넓은 레인지로 오픈 가능

**얼리 포지션(UTG)의 주의점:**
- 타이트한 레인지 유지 필수
- 강한 핸드 위주로 플레이
- 포스트플랍 불리함 인식`,
    tags: ['포지션', '기본전략', '프리플랍'],
    isBookmarked: false,
  },
  {
    id: 2,
    category: '프리플랍',
    title: '3-벳 전략의 기초',
    difficulty: '중급',
    summary: '밸류 핸드와 블러프 핸드의 균형으로 3-벳 레인지를 구성하라',
    content: `효과적인 3-벳 전략은 밸류 핸드와 블러프를 균형있게 섞는 것입니다.

**밸류 3-벳 핸드 (예시):**
- AA, KK, QQ, JJ
- AKs, AKo

**블러프 3-벳 핸드 (예시):**
- A5s~A2s (블로커 효과)
- K5s~K2s
- 적당한 수트드 커넥터

**3-벳 사이징:**
- IP (인 포지션): 오픈의 2.5~3배
- OOP (아웃 오브 포지션): 오픈의 3~4배
- 3-벳 후 콜이 많다면 사이즈 키우기`,
    tags: ['3벳', '어그레시브', '프리플랍'],
    isBookmarked: false,
  },
  {
    id: 3,
    category: '포스트플랍',
    title: 'C-벳(컨티뉴에이션 벳) 활용법',
    difficulty: '기초',
    summary: '프리플랍 어그레서로서 일관성 있는 C-벳으로 폴드 에쿼티를 확보하라',
    content: `C-벳은 프리플랍에서 마지막으로 공격적인 액션을 취한 플레이어가 플랍에서 이어서 베팅하는 것입니다.

**C-벳이 효과적인 상황:**
- 드라이 보드 (예: K-7-2 레인보우)
- 헤즈업 팟
- 상대가 체크한 후
- 자신의 레인지가 보드에 유리할 때

**C-벳 사이징:**
- 드라이 보드: 25~33% 팟
- 웻 보드: 50~75% 팟
- 멀티웨이: 더 크게 (강한 핸드만)

**C-벳을 피해야 할 때:**
- 멀티웨이 팟에서 약한 핸드
- 보드가 상대 레인지에 더 유리할 때`,
    tags: ['C벳', '어그레시브', '포스트플랍'],
    isBookmarked: false,
  },
  {
    id: 4,
    category: '블러핑',
    title: '세미 블러프의 힘',
    difficulty: '중급',
    summary: '아웃츠가 있는 블러프로 두 가지 방법으로 팟을 획득하라',
    content: `세미 블러프는 현재 최선의 핸드는 아니지만, 아웃츠(outs)가 있는 상태에서 베팅하는 것입니다.

**세미 블러프의 장점:**
1. 폴드로 팟 획득 (블러프 성공)
2. 콜을 받아도 드로우 완성 가능

**좋은 세미 블러프 핸드:**
- 플러쉬 드로우 (9 아웃츠)
- 오픈 엔디드 스트레이트 드로우 (8 아웃츠)
- 플러쉬 드로우 + 오버카드
- 거트샷 + 플러쉬 드로우

**아웃츠 계산 (룰 오브 4/2):**
- 턴까지: 아웃츠 × 4 ≈ 완성 확률 (%)
- 리버까지: 아웃츠 × 2 ≈ 완성 확률 (%)`,
    tags: ['블러프', '드로우', '에쿼티'],
    isBookmarked: false,
  },
  {
    id: 5,
    category: '밸류벳',
    title: '씩 밸류 벳(Thin Value Bet)',
    difficulty: '고급',
    summary: '상대가 더 약한 핸드로 콜할 때 작은 에지도 놓치지 마라',
    content: `씩 밸류 벳은 이기고 있다는 확신이 크지 않지만, 약간 앞서 있을 때 베팅하는 고급 기술입니다.

**씩 밸류 벳이 적합한 상황:**
- 미디엄 페어를 들고 드라이 보드에서
- 탑페어 위크 키커
- 리버에서 작은 원 페어

**고려사항:**
- 상대의 콜링 레인지 분석 필수
- 블러프 캐처가 많으면 베팅 유리
- 레이즈 당할 위험 고려
- 작은 사이징으로 오버폴드 방지

**실수 피하기:**
너무 자주 씩 벳을 하면 블러퍼에게 착취당할 수 있습니다. 상대 패턴을 파악 후 적용하세요.`,
    tags: ['밸류벳', '리버', '고급'],
    isBookmarked: false,
  },
  {
    id: 6,
    category: '포지션',
    title: '스틸 & 리스틸 전략',
    difficulty: '중급',
    summary: '버튼/SB/CO에서의 스틸과 BB/SB에서의 리스틸을 마스터하라',
    content: `스틸은 블라인드를 훔치기 위한 늦은 포지션에서의 오픈 레이즈이며, 리스틸은 이를 막기 위한 3-벳입니다.

**스틸 적합 포지션 & 조건:**
- CO, BTN, SB에서 폴드가 많을 때
- 빡빡한 수비자 상대로
- 스택 깊이 충분할 때 (20BB+)

**스틸 핸드 선택:**
- 수트드 에이스 (A5s~A2s)
- 킹 하이 (K9s+)
- 커넥터 (65s+)
- 어느 정도 플레이어블한 핸드

**리스틸 타이밍:**
- 자주 스틸하는 플레이어 상대
- 포지션 이점 있을 때
- 충분한 폴드 에쿼티 (SPR 고려)`,
    tags: ['스틸', '블라인드', '토너먼트'],
    isBookmarked: false,
  },
  {
    id: 7,
    category: '토너먼트',
    title: 'ICM 기초 이해',
    difficulty: '고급',
    summary: 'Independent Chip Model로 토너먼트 팟 오즈를 올바르게 계산하라',
    content: `ICM(Independent Chip Model)은 토너먼트에서 칩 스택이 실제 상금 가치와 다름을 설명합니다.

**ICM의 핵심 원리:**
- 칩은 선형이 아닌 비선형적 가치
- 더블업 = 상금 2배가 아님
- 버블 근처에서 ICM 압박 극대화

**ICM이 중요한 상황:**
1. 버블 (ITM 직전)
2. 파이널 테이블
3. 머니 점프 구간
4. 숏 스택 올인 결정

**실전 ICM 적용:**
- 스택 큰 플레이어: 더 어그레시브하게
- 숏 스택: 더블업 외에 폴드 선호
- 미디엄 스택: 버블에서 타이트하게

ICM을 이해하면 칩EV가 아닌 $EV로 올바른 결정을 내릴 수 있습니다.`,
    tags: ['ICM', '토너먼트', '상금'],
    isBookmarked: false,
  },
  {
    id: 8,
    category: '심리전',
    title: '테이블 이미지 활용',
    difficulty: '고급',
    summary: '자신의 테이블 이미지를 의도적으로 구축하고 역이용하라',
    content: `테이블 이미지는 상대방이 당신을 어떻게 인식하는지에 관한 것으로, 이를 전략적으로 활용하면 큰 이점을 얻을 수 있습니다.

**이미지 유형:**
- **타이트-어그레시브 (TAG)**: 믿을 수 있는 이미지 → 블러프 가치 높음
- **루즈-패시브 (LP)**: 약한 이미지 → 밸류 핸드로 착취당함
- **루즈-어그레시브 (LAG)**: 위협적 이미지 → 밸류 핸드 더 많은 액션

**이미지 구축 전략:**
1. 초반에 쇼다운 핸드로 이미지 설정
2. 블러프 노출로 의도적 루즈 이미지 구축
3. 이후 밸류 핸드에서 더 많은 액션 유도

**상대 이미지 읽기:**
- 타이트한 플레이어의 베팅 = 강한 핸드
- 루즈한 플레이어 상대 = 더 타이트하게 콜
- 틸트 상태 파악 후 착취`,
    tags: ['심리전', '테이블이미지', '고급'],
    isBookmarked: false,
  },
  {
    id: 9,
    category: '포스트플랍',
    title: '보드 텍스처 분석',
    difficulty: '중급',
    summary: '드라이/웻 보드를 구분하고 각각에 맞는 전략을 사용하라',
    content: `보드 텍스처를 이해하면 포스트플랍에서 올바른 베팅 전략을 선택할 수 있습니다.

**드라이 보드 (Dry Board):**
- 예: K♠ 7♦ 2♣
- 드로우 거의 없음
- 작은 사이징의 C-벳 효과적
- 블러프 성공률 높음

**웻 보드 (Wet Board):**
- 예: J♠ T♦ 9♣ (스트레이트 드로우 많음)
- 예: A♥ K♥ 5♥ (플러쉬 드로우)
- 강한 핸드로 더 크게 베팅
- 드로우 가격 비싸게 만들기

**레인보우 vs 모노톤:**
- 레인보우: 상대적으로 드라이
- 투톤: 드로우 가능성 중간
- 모노톤: 매우 웻, 주의 필요`,
    tags: ['보드텍스처', '포스트플랍', '사이징'],
    isBookmarked: false,
  },
];

const DIFFICULTY_COLORS = {
  '기초': 'beginner',
  '중급': 'intermediate',
  '고급': 'advanced',
};

export default function StrategyTips() {
  const [tips, setTips] = useState(TIPS);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTip, setSelectedTip] = useState(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === '전체' || tip.category === selectedCategory;
    const matchesBookmark = !showBookmarked || tip.isBookmarked;
    const matchesSearch = !searchQuery ||
      tip.title.includes(searchQuery) ||
      tip.summary.includes(searchQuery) ||
      tip.tags.some(t => t.includes(searchQuery));
    return matchesCategory && matchesBookmark && matchesSearch;
  });

  function toggleBookmark(id) {
    setTips(prev => prev.map(t => t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t));
    if (selectedTip?.id === id) {
      setSelectedTip(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    }
  }

  function formatContent(content) {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} className="tip-heading">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="tip-list-item">{line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^- /, '')}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="tip-list-item numbered">{line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
      }
      if (line === '') return <br key={i} />;
      return <p key={i} className="tip-paragraph" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
    });
  }

  return (
    <div className="strategy-tips">
      <div className="tips-header">
        <h2>전략 & 팁 큐레이션</h2>
        <p className="subtitle">포커 실력 향상을 위한 핵심 전략을 단계별로 학습하세요</p>
      </div>

      <div className="tips-controls">
        <input
          className="search-input"
          placeholder="전략 검색..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button
          className={`bookmark-filter-btn ${showBookmarked ? 'active' : ''}`}
          onClick={() => setShowBookmarked(v => !v)}
        >
          ★ 북마크
        </button>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tips-layout">
        <div className="tips-list">
          {filteredTips.length === 0 && (
            <div className="empty-state">검색 결과가 없습니다</div>
          )}
          {filteredTips.map(tip => (
            <div
              key={tip.id}
              className={`tip-card ${selectedTip?.id === tip.id ? 'selected' : ''}`}
              onClick={() => setSelectedTip(tip)}
            >
              <div className="tip-card-header">
                <span className={`difficulty-badge ${DIFFICULTY_COLORS[tip.difficulty]}`}>
                  {tip.difficulty}
                </span>
                <span className="tip-category-tag">{tip.category}</span>
                <button
                  className={`bookmark-btn ${tip.isBookmarked ? 'bookmarked' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleBookmark(tip.id); }}
                >
                  {tip.isBookmarked ? '★' : '☆'}
                </button>
              </div>
              <h3 className="tip-title">{tip.title}</h3>
              <p className="tip-summary">{tip.summary}</p>
              <div className="tip-tags">
                {tip.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
              </div>
            </div>
          ))}
        </div>

        {selectedTip && (
          <div className="tip-detail">
            <div className="tip-detail-header">
              <div className="tip-detail-meta">
                <span className={`difficulty-badge ${DIFFICULTY_COLORS[selectedTip.difficulty]}`}>
                  {selectedTip.difficulty}
                </span>
                <span className="tip-category-tag">{selectedTip.category}</span>
              </div>
              <button
                className={`bookmark-btn large ${selectedTip.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => toggleBookmark(selectedTip.id)}
              >
                {selectedTip.isBookmarked ? '★' : '☆'}
              </button>
            </div>
            <h2 className="tip-detail-title">{selectedTip.title}</h2>
            <p className="tip-detail-summary">{selectedTip.summary}</p>
            <div className="tip-detail-content">
              {formatContent(selectedTip.content)}
            </div>
            <div className="tip-tags">
              {selectedTip.tags.map(tag => <span key={tag} className="tag">{`#${tag}`}</span>)}
            </div>
            <button className="close-detail-btn" onClick={() => setSelectedTip(null)}>닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}
