import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type FrontmatterMap = Record<string, string | string[]>;

export type ContentEntry = {
  body: string;
  excerpt: string;
  frontmatter: FrontmatterMap;
  slug: string;
  title: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

export async function getPageBySlug(slug: string): Promise<ContentEntry> {
  const entry = await readMarkdownEntry(path.join(CONTENT_ROOT, "pages", `${slug}.md`));
  return normalizeEntry(entry);
}

export async function getWorkBySlug(slug: string): Promise<ContentEntry> {
  const entry = await readMarkdownEntry(path.join(CONTENT_ROOT, "work", `${slug}.md`));
  return normalizeEntry(entry);
}

export async function getWorkEntries(): Promise<ContentEntry[]> {
  const directory = path.join(CONTENT_ROOT, "work");
  const fileNames = (await readdir(directory)).filter((name) => name.endsWith(".md"));

  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const entry = await readMarkdownEntry(path.join(directory, fileName));
      return normalizeEntry(entry);
    }),
  );

  return entries.sort((left, right) =>
    getFrontmatterText(right.frontmatter, "date").localeCompare(
      getFrontmatterText(left.frontmatter, "date"),
    ),
  );
}

export async function getWorkSlugs(): Promise<string[]> {
  const directory = path.join(CONTENT_ROOT, "work");
  const fileNames = (await readdir(directory)).filter((name) => name.endsWith(".md"));
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getFrontmatterText(frontmatter: FrontmatterMap, key: string): string {
  const value = frontmatter[key];
  return typeof value === "string" ? value : "";
}

export function getFrontmatterList(frontmatter: FrontmatterMap, key: string): string[] {
  const value = frontmatter[key];
  return Array.isArray(value) ? value : [];
}

async function readMarkdownEntry(filePath: string): Promise<{
  body: string;
  frontmatter: FrontmatterMap;
}> {
  const raw = await readFile(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function normalizeEntry(entry: { body: string; frontmatter: FrontmatterMap }): ContentEntry {
  return {
    body: entry.body,
    excerpt: getFrontmatterText(entry.frontmatter, "excerpt"),
    frontmatter: entry.frontmatter,
    slug: getFrontmatterText(entry.frontmatter, "slug"),
    title: getFrontmatterText(entry.frontmatter, "title"),
  };
}

function parseFrontmatter(frontmatter: string): FrontmatterMap {
  const result: FrontmatterMap = {};
  const lines = frontmatter.split("\n");
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    if (line.startsWith("  - ") && currentArrayKey) {
      const existing = result[currentArrayKey];
      if (Array.isArray(existing)) {
        existing.push(stripWrappingQuotes(line.slice(4).trim()));
      }
      continue;
    }

    currentArrayKey = null;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!value) {
      result[key] = [];
      currentArrayKey = key;
      continue;
    }

    result[key] = stripWrappingQuotes(value);
  }

  return result;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
