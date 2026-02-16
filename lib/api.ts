import * as SecureStore from 'expo-secure-store';
import type { Student } from '../components/StudentCard';
import { API_BASE_URL } from '../constants/api';

const REQUEST_TIMEOUT_MS = 60000;
const TOKEN_KEY = 'userToken';
const ROLE_KEY = 'userRole';
let cachedToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;
let sessionAuthed = false;
let sessionRole: UserRole | null = null;

export type UserRole = 'admin' | 'staff';

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export const setSessionAuthed = (value: boolean) => {
  sessionAuthed = value;
};

export const getSessionAuthed = () => sessionAuthed;

export const setSessionRole = (value: UserRole | null) => {
  sessionRole = value;
};

export const getSessionRole = () => sessionRole;

export const isAuthErrorMessage = (message: string | null | undefined) => {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes('not authorized') ||
    normalized.includes('not authorised') ||
    normalized.includes('no token') ||
    normalized.includes('token failed') ||
    normalized.includes('request failed (401)') ||
    normalized.includes('request failed (403)') ||
    normalized === 'forbidden'
  );
};

export const hydrateSession = async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const roleRaw = await SecureStore.getItemAsync(ROLE_KEY);
  const role = isUserRole(roleRaw) ? roleRaw : null;

  cachedToken = token;
  sessionAuthed = Boolean(token);
  sessionRole = role;

  return { token, role, authed: sessionAuthed };
};

export const persistSession = async (token: string, role: UserRole) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(ROLE_KEY, role);
  cachedToken = token;
  sessionAuthed = true;
  sessionRole = role;
};

export type StandardApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type LoginData = {
  token: string;
  user: { id: string; email: string; name: string; role: UserRole };
};

type DashboardStats = {
  totalStudents: number;
  totalFeesCollected: number;
  monthFeesCollected: number;
};

type StudentInput = {
  name: string;
  grade?: string;
  father_name: string;
  mother_name: string;
  mobile_no: string;
  fees_paid?: number;
  teacher?: string;
};

type DeleteResult = {
  success?: boolean;
  message?: string;
};

type FeePayment = {
  _id: string;
  studentId: string;
  amount: number;
  date: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isUserRole = (value: unknown): value is UserRole =>
  value === 'admin' || value === 'staff';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const toNumber = (value: unknown): number | null => {
  if (isNumber(value)) return value;
  if (isString(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toStringId = (value: unknown): string | null => {
  if (isString(value)) return value;
  if (isNumber(value)) return String(value);
  return null;
};

const toStringOrEmpty = (value: unknown): string =>
  isString(value) ? value : '';

const toNullableString = (value: unknown): string | null =>
  value === null || value === undefined ? null : isString(value) ? value : null;

const isApiEnvelope = (value: unknown): value is ApiEnvelope<unknown> =>
  isRecord(value) && typeof value.success === 'boolean';

const getErrorMessage = (value: unknown): string | null => {
  if (isRecord(value) && isString(value.error)) {
    return value.error;
  }
  return null;
};

const parseLoginData = (value: unknown): LoginData | null => {
  if (!isRecord(value)) return null;
  if (!isString(value.token)) return null;
  const user = value.user;
  if (!isRecord(user)) return null;
  if (!isString(user.id) || !isString(user.email) || !isString(user.name)) {
    return null;
  }
  const role = isUserRole(user.role) ? user.role : null;
  if (!role) return null;
  return { token: value.token, user: { id: user.id, email: user.email, name: user.name, role } };
};

const parseDashboardStats = (value: unknown): DashboardStats | null => {
  if (!isRecord(value)) return null;
  if (!isNumber(value.totalStudents) || !isNumber(value.totalFeesCollected)) {
    return null;
  }
  const monthFeesCollected = toNumber(value.monthFeesCollected) ?? 0;
  return {
    totalStudents: value.totalStudents,
    totalFeesCollected: value.totalFeesCollected,
    monthFeesCollected,
  };
};

const parseStudent = (value: unknown): Student | null => {
  if (!isRecord(value)) return null;
  const id = toStringId(value._id ?? value.id);
  if (!id) return null;
  const name = toStringOrEmpty(value.name);
  if (!name) return null;
  const grade = toNullableString(value.grade);
  const father_name = toStringOrEmpty(value.father_name);
  const mother_name = toStringOrEmpty(value.mother_name);
  const mobile_no = toStringOrEmpty(value.mobile_no);
  const fees_paid = toNumber(value.fees_paid) ?? 0;
  const createdAt = isString(value.createdAt)
    ? value.createdAt
    : isString(value.created_at)
      ? value.created_at
      : '';
  const updatedAt = isString(value.updatedAt)
    ? value.updatedAt
    : isString(value.updated_at)
      ? value.updated_at
      : '';
  return {
    _id: id,
    name,
    grade,
    father_name,
    mother_name,
    mobile_no,
    fees_paid,
    createdAt,
    updatedAt,
  };
};

const parseStudentArray = (value: unknown): Student[] | null => {
  if (!Array.isArray(value)) return null;
  const parsed: Student[] = [];
  for (const item of value) {
    const student = parseStudent(item);
    if (!student) return null;
    parsed.push(student);
  }
  return parsed;
};

const parseDeleteResult = (value: unknown): DeleteResult | null => {
  if (!isRecord(value)) return null;
  if (value.success !== undefined && typeof value.success !== 'boolean') return null;
  if (value.message !== undefined && !isString(value.message)) return null;
  return { success: value.success, message: value.message };
};

const parseFeePayment = (value: unknown): FeePayment | null => {
  if (!isRecord(value)) return null;
  const id = toStringId(value._id);
  if (!id) return null;
  if (!isString(value.studentId)) return null;
  const amount = toNumber(value.amount);
  if (amount === null) return null;
  if (!isString(value.date)) return null;
  return { _id: id, studentId: value.studentId, amount, date: value.date };
};

const mapResponse = <T>(
  res: StandardApiResponse<unknown>,
  parser: (data: unknown) => T | null,
  invalidMessage = 'Invalid server response'
): StandardApiResponse<T> => {
  if (!res.success) {
    return { success: false, data: null, error: res.error };
  }
  const parsed = parser(res.data);
  if (!parsed) {
    return { success: false, data: null, error: invalidMessage };
  }
  return { success: true, data: parsed, error: null };
};

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<StandardApiResponse<unknown>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method ?? 'GET';

  console.log('[API Request]', method, url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let token = cachedToken;
    if (!token) {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
      cachedToken = token;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      if (Array.isArray(options.headers)) {
        for (const [key, value] of options.headers) {
          headers[key] = value;
        }
      } else if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    let json: unknown = null;

    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        return {
          success: false,
          data: null,
          error: `Invalid JSON response (status ${response.status})`,
        };
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(ROLE_KEY);
        cachedToken = null;
        sessionAuthed = false;
        sessionRole = null;
        if (unauthorizedHandler) {
          unauthorizedHandler();
        }
      }
      return {
        success: false,
        data: null,
        error: getErrorMessage(json) ?? `Request failed (${response.status})`,
      };
    }

    if (isApiEnvelope(json)) {
      if (!json.success) {
        return {
          success: false,
          data: null,
          error: getErrorMessage(json) ?? 'Request failed',
        };
      }
      return {
        success: true,
        data: json.data ?? null,
        error: null,
      };
    }

    return {
      success: true,
      data: json,
      error: null,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        data: null,
        error: 'Request timed out. Server not reachable.',
      };
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Network error: ${message}`,
    };
  }
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return mapResponse<LoginData>(res, parseLoginData);
  },

  getDashboardStats: async () => {
    const res = await apiRequest('/api/dashboard/stats');
    return mapResponse<DashboardStats>(res, parseDashboardStats);
  },

  getStudents: async () => {
    const res = await apiRequest('/api/students');
    return mapResponse<Student[]>(res, parseStudentArray);
  },

  getStudent: async (id: string) => {
    const res = await apiRequest(`/api/students/${id}`);
    return mapResponse<Student>(res, parseStudent);
  },

  addStudent: async (data: StudentInput) => {
    const res = await apiRequest('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapResponse<Student>(res, parseStudent);
  },

  updateStudent: async (id: string, data: Partial<StudentInput>) => {
    const res = await apiRequest(`/api/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return mapResponse<Student>(res, parseStudent);
  },

  deleteStudent: async (id: string) => {
    const res = await apiRequest(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.success) {
      return { success: false, data: null, error: res.error };
    }
    const parsed = parseDeleteResult(res.data);
    return { success: true, data: parsed, error: null };
  },

  payFee: async (studentId: string, amount: number) => {
    const res = await apiRequest('/api/fees/pay', {
      method: 'POST',
      body: JSON.stringify({ studentId, amount }),
    });
    return mapResponse<FeePayment>(res, parseFeePayment);
  },
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(ROLE_KEY);
  cachedToken = null;
  sessionAuthed = false;
  sessionRole = null;
};

export const setAuthToken = (token: string | null) => {
  cachedToken = token;
  sessionAuthed = Boolean(token);
};
