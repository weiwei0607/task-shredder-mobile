// Set EXPO_PUBLIC_BACKEND_URL in your .env to point to your Next.js server
export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

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
