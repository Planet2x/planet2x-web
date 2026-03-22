import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const REQUIRED_FIELDS = ["title", "slug", "date", "excerpt", "coverImage"];
const TARGET_DIRS = ["work", "fragments", "pages"];

async function getMarkdownFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dirPath, entry.name));
}

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function hasField(frontmatter, field) {
  const pattern = new RegExp(`^${field}:`, "m");
  return pattern.test(frontmatter);
}

async function validateFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  const frontmatter = getFrontmatter(raw);

  if (!frontmatter) {
    return [`Missing frontmatter in ${path.relative(process.cwd(), filePath)}`];
  }

  return REQUIRED_FIELDS.flatMap((field) =>
    hasField(frontmatter, field)
      ? []
      : [`Missing "${field}" in ${path.relative(process.cwd(), filePath)}`],
  );
}

async function main() {
  const files = (
    await Promise.all(
      TARGET_DIRS.map((dir) => getMarkdownFiles(path.join(CONTENT_ROOT, dir))),
    )
  ).flat();

  const errors = (await Promise.all(files.map(validateFile))).flat();

  if (errors.length > 0) {
    console.error("Content validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${files.length} content files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

