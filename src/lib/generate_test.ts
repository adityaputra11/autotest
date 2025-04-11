import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: "sk-2f21e8ab30924c13bdbd79959fefd03c",  //YOUR API KEY HERE
  baseURL: 'https://api.deepseek.com',
});

export async function generateTestForFile(sourceCode: string, filePath: string): Promise<string> {
  const prompt = `Buatkan unit test dengan Jest untuk file berikut:

// ${filePath}
${sourceCode}`;

  const completion = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'Kamu adalah AI yang menulis unit test TypeScript menggunakan Jest. Hanya keluarkan kode test saja, tidak perlu keterangan lainnya.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
  });

  const fullResponse = completion.choices[0].message.content ?? '// Gagal generate test';

  const match = fullResponse.match(/```typescript\n([\s\S]*?)```/);
  if (match) {
    return match[1].trim();
  }

  // Fallback kalau ga nemu
  return fullResponse
    .replace(/```typescript/, '')
    .replace(/```/, '')
    .trim();
}
