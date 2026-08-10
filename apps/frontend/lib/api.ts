import type {
  EmailResponse,
  Job,
  JobAnalysis,
  JobListResponse,
  LoginResponse,
  ResumeListResponse,
  UploadSummary,
  User,
} from "./types";

const API_URL = "/api/proxy";

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const error = await response.json();
      message = error.detail ?? message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const body = new URLSearchParams();

  body.set("username", username);
  body.set("password", password);

  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

export async function getCurrentUser(token: string): Promise<User> {
  return apiFetch<User>("/auth/me", {}, token);
}

export async function getJobs(
  token: string,
  params?: {
    skip?: number;
    limit?: number;
    status?: "OPEN" | "CLOSED";
  },
): Promise<JobListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();

  return apiFetch<JobListResponse>(
    `/jobs${query ? `?${query}` : ""}`,
    {},
    token,
  );
}

export async function getJob(
  token: string,
  jobId: string,
): Promise<Job> {
  return apiFetch<Job>(`/jobs/${jobId}`, {}, token);
}

export async function getResumes(
  token: string,
  jobId: string,
): Promise<ResumeListResponse> {
  return apiFetch<ResumeListResponse>(
    `/jobs/${jobId}/resumes`,
    {},
    token,
  );
}

export async function uploadResumes(
  token: string,
  jobId: string,
  file: File,
): Promise<UploadSummary> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UploadSummary>(
    `/jobs/${jobId}/upload-resumes`,
    {
      method: "POST",
      body: formData,
    },
    token,
  );
}

export async function analyzeJob(
  token: string,
  jobId: string,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/jobs/${jobId}/analyze`,
    {
      method: "POST",
    },
    token,
  );
}

export async function getJobAnalysis(
  token: string,
  jobId: string,
): Promise<JobAnalysis> {
  return apiFetch<JobAnalysis>(
    `/jobs/${jobId}/analysis`,
    {},
    token,
  );
}

export async function sendCandidateDecision(
  token: string,
  jobId: string,
  resumeId: string,
  decision: "SHORTLIST" | "REJECT",
): Promise<EmailResponse> {
  return apiFetch<EmailResponse>(
    `/jobs/${jobId}/resumes/${resumeId}/decision`,
    {
      method: "POST",
      body: JSON.stringify({ decision }),
    },
    token,
  );
}