import { GraphQLClient } from "graphql-request";

const WP_URL =
  process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

const GRAPHQL_ENDPOINT = `${WP_URL}/graphql`;
const REST_BASE = `${WP_URL}/wp-json/wp/v2`;

// Shared fetch wrapper for WP REST API with ISR tags
export async function wpRest<T>(
  path: string,
  init?: { tags?: string[]; revalidate?: number }
): Promise<T> {
  const res = await fetch(`${REST_BASE}${path}`, {
    next: {
      tags: init?.tags ?? ["wordpress"],
      revalidate: init?.revalidate ?? 3600, // 1h default ISR
    },
  });
  if (!res.ok) {
    throw new Error(`WP REST failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export function getGraphQLClient() {
  return new GraphQLClient(GRAPHQL_ENDPOINT);
}

export async function wpGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const client = getGraphQLClient();
  return client.request<T>(query, variables);
}

// ---- Minimal types for school site ----
export type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
};

export async function getNotices(limit = 10): Promise<WPPost[]> {
  // Maps to WP posts (category "notice" recommended in CMS setup)
  return wpRest<WPPost[]>(`/posts?per_page=${limit}&_fields=id,slug,title,excerpt,date`, {
    tags: ["posts", "notices"],
  });
}
