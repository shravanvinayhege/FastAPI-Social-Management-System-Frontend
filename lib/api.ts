export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fastapi-management-system.onrender.com";

const TOKEN_KEY = "token";
const LEGACY_TOKEN_KEY = "access_token";

type JsonRecord = Record<string, unknown>;

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type UserOut = {
  id: number;
  email: string;
  created_at: string;
};

export type PostEntity = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  owner_id: number;
  owner: UserOut;
};

export type PostWithVotes = {
  Post: PostEntity;
  votes: number;
};

type RequestOptions = {
  json?: boolean;
  auth?: boolean;
};

function buildUrl(path: string): string {
  const base = API_URL.replace(/\/$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}`;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function getCurrentUserId(): number | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { user_id?: number | string; id?: number | string };
    const rawId = payload.user_id ?? payload.id;
    const parsed = typeof rawId === "string" ? Number(rawId) : rawId;
    return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

export function logout(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = { json: true, auth: false }
): Promise<T> {
  const headers = new Headers(init.headers ?? {});

  if (options.json !== false && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  const data = (await parseJsonSafe(response)) as JsonRecord | null;

  if (!response.ok) {
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : `Request failed (${response.status} ${response.statusText})`;
    throw new Error(detail);
  }

  return data as T;
}

export async function login(email: string, password: string): Promise<AuthToken> {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const data = await request<AuthToken>(
    "/login",
    {
      method: "POST",
      body: form,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    { json: false, auth: false }
  );

  if (!data.access_token) {
    throw new Error("Login response did not include access_token.");
  }

  setToken(data.access_token);
  return data;
}

export async function registerUser(email: string, password: string): Promise<UserOut> {
  return request<UserOut>("/users/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export type GetPostsOptions = { limit?: number; skip?: number; search?: string };

export async function getPosts(options: GetPostsOptions = {}): Promise<PostWithVotes[]> {
  const params = new URLSearchParams();
  if (options.limit !== undefined) params.set("limit", String(options.limit));
  if (options.skip !== undefined) params.set("skip", String(options.skip));
  if (options.search) params.set("search", options.search);

  const query = params.toString();
  const path = query ? `/posts/?${query}` : "/posts/";
  return request<PostWithVotes[]>(path, { method: "GET" }, { auth: true, json: true });
}

export async function createPost(
  title: string,
  content: string,
  published = true
): Promise<PostEntity> {
  return request<PostEntity>(
    "/posts/",
    {
      method: "POST",
      body: JSON.stringify({ title, content, published }),
    },
    { auth: true, json: true }
  );
}

export async function updatePost(
  postId: number,
  title: string,
  content: string,
  published = true
): Promise<PostEntity> {
  return request<PostEntity>(
    `/posts/${postId}`,
    {
      method: "PUT",
      body: JSON.stringify({ title, content, published }),
    },
    { auth: true, json: true }
  );
}

export async function deletePost(postId: number): Promise<void> {
  await request<unknown>(`/posts/${postId}`, { method: "DELETE" }, { auth: true, json: true });
}

export async function vote(postId: number, dir: 0 | 1): Promise<{ message: string }> {
  return request<{ message: string }>(
    "/vote/",
    {
      method: "POST",
      body: JSON.stringify({ post_id: postId, dir }),
    },
    { auth: true, json: true }
  );
}

// Users
export async function listUsers(): Promise<UserOut[]> {
  return request<UserOut[]>("/users/", { method: "GET" }, { auth: true, json: true });
}

export async function getUser(id: number): Promise<UserOut> {
  return request<UserOut>(`/users/${id}`, { method: "GET" }, { auth: true, json: true });
}
