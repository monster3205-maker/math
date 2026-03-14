export type Role = 'teacher' | 'student' | 'admin';

export interface AuthUser {
  userId: string;
  role: Role;
}

const STORAGE_KEY = 'auth_user';

function detectRole(userId: string): Role | null {
  const id = userId.trim().toLowerCase();
  if (id.startsWith('admin')) return 'admin';
  if (id.startsWith('teacher')) return 'teacher';
  if (id.startsWith('student')) return 'student';
  return null;
}

export function login(userId: string): AuthUser | null {
  const role = detectRole(userId);
  if (!role) return null;
  const user: AuthUser = { userId: userId.trim(), role };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const ROLE_HOME: Record<Role, string> = {
  admin: '/reports',
  teacher: '/reports',
  student: '/student',
};

// 각 role이 접근 가능한 경로 목록
export const ALLOWED_PATHS: Record<Role, string[]> = {
  admin: ['/reports', '/exam', '/students', '/textbook', '/schedule', '/settings'],
  teacher: ['/reports', '/schedule'],
  student: ['/student'],
};

export function canAccess(role: Role, pathname: string): boolean {
  return ALLOWED_PATHS[role].some((p) => pathname === p || pathname.startsWith(p + '/'));
}
