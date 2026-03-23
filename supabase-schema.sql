-- ============================================================
-- 골프 성적 관리 앱 - Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 전체 실행
-- ============================================================

-- 1. 멤버 테이블
CREATE TABLE IF NOT EXISTS members (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  handicap    INTEGER NOT NULL DEFAULT 0 CHECK (handicap >= 0 AND handicap <= 54),
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 라운드(성적) 테이블
CREATE TABLE IF NOT EXISTS rounds (
  id          BIGSERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  course      TEXT NOT NULL,
  member_id   BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  par         INTEGER NOT NULL DEFAULT 72,
  holes       JSONB NOT NULL,         -- 18홀 스코어 배열 [4,5,3,...]
  total       INTEGER NOT NULL,
  net         INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_rounds_member_id ON rounds(member_id);
CREATE INDEX IF NOT EXISTS idx_rounds_date      ON rounds(date DESC);

-- ============================================================
-- Row Level Security (RLS) 설정
-- 공개 앱 기준: anon 키로 읽기/쓰기 허용
-- 인증이 필요한 경우 아래 정책을 수정하세요.
-- ============================================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds  ENABLE ROW LEVEL SECURITY;

-- members: 전체 공개 접근
CREATE POLICY "members_public_select" ON members FOR SELECT USING (true);
CREATE POLICY "members_public_insert" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "members_public_update" ON members FOR UPDATE USING (true);
CREATE POLICY "members_public_delete" ON members FOR DELETE USING (true);

-- rounds: 전체 공개 접근
CREATE POLICY "rounds_public_select" ON rounds FOR SELECT USING (true);
CREATE POLICY "rounds_public_insert" ON rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "rounds_public_update" ON rounds FOR UPDATE USING (true);
CREATE POLICY "rounds_public_delete" ON rounds FOR DELETE USING (true);
