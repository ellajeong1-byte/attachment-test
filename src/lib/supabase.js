const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SESSION_KEY = 'writers_room_session';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function notifyAuth(nextSession) {
  window.dispatchEvent(new CustomEvent('writers-room-auth', { detail: nextSession }));
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifyAuth(session);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  notifyAuth(null);
}

function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
}

async function authRequest(path, payload) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return { data: null, error: { message: data.msg || data.error_description || 'Auth request failed.' } };
  }

  const session = data.access_token
    ? {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    }
    : null;

  if (session) {
    saveSession(session);
  }

  return { data, error: null };
}

export const supabase = isSupabaseConfigured
  ? {
    auth: {
      signInWithPassword: ({ email, password }) => authRequest('token?grant_type=password', { email, password }),
      signUp: ({ email, password }) => authRequest('signup', { email, password }),
      signOut: async () => {
        clearSession();
        return { error: null };
      },
      getSession: async () => ({ data: { session: getStoredSession() } }),
      onAuthStateChange: (callback) => {
        const handler = (event) => callback('SIGNED_IN', event.detail);
        window.addEventListener('writers-room-auth', handler);
        return {
          data: {
            subscription: {
              unsubscribe: () => window.removeEventListener('writers-room-auth', handler),
            },
          },
        };
      },
    },
  }
  : null;
