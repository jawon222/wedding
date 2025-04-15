// Cloudflare Worker API
export interface Env {
  DB: D1Database;
}

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env) {
    // CORS 프리플라이트 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 라우팅 처리
      if (path === '/api/messages' && request.method === 'GET') {
        return await getMessages(env.DB);
      }
      if (path === '/api/messages' && request.method === 'POST') {
        return await createMessage(request, env.DB);
      }
      if (path.startsWith('/api/messages/') && request.method === 'PUT') {
        return await updateMessage(request, env.DB);
      }
      if (path.startsWith('/api/messages/') && request.method === 'DELETE') {
        return await deleteMessage(request, env.DB);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(error.message, { status: 500 });
    }
  },
};

// 메시지 조회
async function getMessages(db: D1Database) {
  const messages = await db.prepare(
    'SELECT id, name, message, created_at FROM messages ORDER BY created_at DESC LIMIT 10'
  ).all();

  return new Response(JSON.stringify(messages), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// 메시지 생성
async function createMessage(request: Request, db: D1Database) {
  const { name, password, message } = await request.json();

  const result = await db.prepare(
    'INSERT INTO messages (name, password_hash, message) VALUES (?, ?, ?)'
  ).bind(name, await hashPassword(password), message).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// 메시지 수정
async function updateMessage(request: Request, db: D1Database) {
  const id = request.url.split('/').pop();
  const { password, message } = await request.json();

  // 비밀번호 확인
  const stored = await db.prepare(
    'SELECT password_hash FROM messages WHERE id = ?'
  ).bind(id).first();

  if (!stored || !(await verifyPassword(password, stored.password_hash))) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  await db.prepare(
    'UPDATE messages SET message = ? WHERE id = ?'
  ).bind(message, id).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// 메시지 삭제
async function deleteMessage(request: Request, db: D1Database) {
  const id = request.url.split('/').pop();
  const { adminPassword } = await request.json();

  // 관리자 비밀번호 확인
  if (adminPassword !== env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  await db.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
} 