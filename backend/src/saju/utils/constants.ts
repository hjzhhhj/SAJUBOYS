export const ELEMENT_EMOJI: Record<string, string> = {
  목: '🌳',
  화: '🔥',
  토: '⛰️',
  금: '⚔️',
  수: '💧',
};

export const ELEMENT_HANJA: Record<string, string> = {
  목: '木',
  화: '火',
  토: '土',
  금: '金',
  수: '水',
};

export class FIVE_ELEMENTS {
  static readonly 천간: Record<string, string> = {
    갑: '목',
    을: '목',
    병: '화',
    정: '화',
    무: '토',
    기: '토',
    경: '금',
    신: '금',
    임: '수',
    계: '수',
  };

  static readonly 지지: Record<string, string> = {
    자: '수',
    축: '토',
    인: '목',
    묘: '목',
    진: '토',
    사: '화',
    오: '화',
    미: '토',
    신: '금',
    유: '금',
    술: '토',
    해: '수',
  };

  static getElementFromStem(stem: string): string {
    return this.천간[stem] || '목';
  }

  static getElementFromBranch(branch: string): string {
    return this.지지[branch] || '목';
  }
}
