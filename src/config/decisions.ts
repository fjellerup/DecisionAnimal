// Simple decision structure for localStorage
export interface SimpleDecision {
  id: number;
  text: string;
  color: string;
  buttonColor: string;
  confetti: boolean;
}

// Default decisions per language
export const defaultDecisions: { [lang: string]: SimpleDecision[] } = {
  en: [
    { id: 1, text: "Yes", color: "#4CAF50", buttonColor: "#4CAF50", confetti: true },
    { id: 2, text: "No", color: "#f44336", buttonColor: "#f44336", confetti: false },
    { id: 3, text: "Think about it again", color: "#FF9800", buttonColor: "#FF9800", confetti: false },
  ],
  da: [
    { id: 1, text: "Ja", color: "#4CAF50", buttonColor: "#4CAF50", confetti: true },
    { id: 2, text: "Nej", color: "#f44336", buttonColor: "#f44336", confetti: false },
    { id: 3, text: "Tænk over det igen", color: "#FF9800", buttonColor: "#FF9800", confetti: false },
  ],
};

export function getDefaultDecisions(lang: string): SimpleDecision[] {
  return defaultDecisions[lang] || defaultDecisions['en'];
}

export function loadDecisions(lang: string): SimpleDecision[] {
  const stored = localStorage.getItem(`decisions_${lang}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultDecisions(lang);
    }
  }
  return getDefaultDecisions(lang);
}

export function saveDecisions(lang: string, decisions: SimpleDecision[]): void {
  localStorage.setItem(`decisions_${lang}`, JSON.stringify(decisions));
}

export function clearDecisions(lang: string): void {
  localStorage.removeItem(`decisions_${lang}`);
}

export function generateId(decisions: SimpleDecision[]): number {
  return Math.max(0, ...decisions.map(d => d.id)) + 1;
}
