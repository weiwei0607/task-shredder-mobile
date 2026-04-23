// 🔧 開發時請將此 IP 改為您電腦在區域網路的 IP（執行 next dev 時會顯示 Network: http://xxx:3000）
export const BACKEND_URL = 'http://172.20.10.3:3000';

export async function analyzeText(text: string, mode: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, mode }),
  });
  if (!response.ok) throw new Error('AI 解析失敗');
  return response.json();
}

export function makeId(prefix: string): string {
  return prefix + '_' + Math.random().toString(36).substring(2, 11);
}

export function formatTasks(rawTasks: any[]): any[] {
  return rawTasks.map((task: any) => ({
    ...task,
    id: makeId('t'),
    subtasks: (task.subtasks || []).map((sub: any) => ({
      ...sub,
      id: makeId('s'),
      completed: false,
    })),
  }));
}
