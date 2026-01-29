import { API_BASE_URL } from '../constants/api';

const REQUEST_TIMEOUT_MS = 15000; // 15 seconds

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: json.error || `Request failed (${res.status})` };
    }
    return { ok: true, data: json as T };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return { ok: false, error: 'Request timed out. Check if the server is running.' };
      }
      return { ok: false, error: err.message };
    }
    return { ok: false, error: 'Network error' };
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<{ success: boolean; user: { id: number; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getDashboardStats: () =>
    request<{ studentsEnrolled: number; feesCollected: number; feesPending: number }>(
      '/dashboard/stats'
    ),

  getStudents: (search?: string) =>
    request<Array<{
      id: number;
      name: string;
      grade: string | null;
      father_name: string | null;
      mother_name: string | null;
      mobile_no: string | null;
      fees_paid: number;
      total_fees: number;
    }>>(search ? `/students?search=${encodeURIComponent(search)}` : '/students'),

  getStudent: (id: number) =>
    request<{
      id: number;
      name: string;
      grade: string | null;
      father_name: string | null;
      mother_name: string | null;
      mobile_no: string | null;
      teacher: string | null;
      fees_paid: number;
      total_fees: number;
    }>(`/students/${id}`),

  addStudent: (data: {
    name: string;
    grade?: string;
    father_name?: string;
    mother_name?: string;
    mobile_no?: string;
    fees_paid?: number;
  }) =>
    request<{ id: number }>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStudent: (
    id: number,
    data: Partial<{
      name: string;
      grade: string;
      father_name: string;
      mother_name: string;
      mobile_no: string;
      fees_paid: number;
      teacher: string;
    }>
  ) =>
    request<{ id: number }>(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteStudent: (id: number) =>
    request<{ success: boolean }>(`/students/${id}`, { method: 'DELETE' }),

  deleteStudentByName: (name: string) =>
    request<{ success: boolean }>(`/students/by-name/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),

  searchFees: (name: string) =>
    request<
      Array<{
        id: number;
        name: string;
        father_name: string | null;
        mother_name: string | null;
        mobile_no: string | null;
        total_fees: number;
        fees_paid: number;
        balance_fees: number;
      }>
    >(`/fees/search?name=${encodeURIComponent(name)}`),

  getFeeDetails: (studentId: number) =>
    request<{
      id: number;
      name: string;
      father_name: string | null;
      mother_name: string | null;
      mobile_no: string | null;
      total_fees: number;
      fees_paid: number;
      balance_fees: number;
    }>(`/fees/${studentId}`),

  updateFees: (studentId: number, fees_paid: number) =>
    request<{ fees_paid: number }>(`/fees/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fees_paid }),
    }),
};

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}
