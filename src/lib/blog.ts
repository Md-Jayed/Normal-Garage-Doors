import { BlogPost } from '../types';

function parseFrontmatter(rawContent: string): { data: Record<string, string>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = rawContent.trimStart().match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, string> = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      const key = trimmed.slice(0, colonIndex).trim();
      let val = trimmed.slice(colonIndex + 1).trim();

      // Remove quotes if enclosed
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }

  return { data, content };
}

// Read all markdown and mdx files from /content/blog/
const rawBlogModules = import.meta.glob('/content/blog/*.{md,mdx}', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const filePath in rawBlogModules) {
    const rawModule = rawBlogModules[filePath];
    const rawContent = typeof rawModule === 'string' ? rawModule : rawModule.default;

    if (!rawContent) continue;

    try {
      const parsed = parseFrontmatter(rawContent);
      const data = parsed.data;

      // Extract file slug fallback if missing in frontmatter
      const fileName = filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') || '';
      const slug = data.slug || fileName;

      posts.push({
        title: data.title || 'Untitled Post',
        description: data.description || '',
        slug: slug,
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
        author: data.author || 'Normal Garage Door Repair Team',
        featuredImage: data.featuredImage || '/images/garage-door-repair.webp',
        featuredImageAlt: data.featuredImageAlt || data.title || 'Garage door repair image',
        primaryKeyword: data.primaryKeyword || 'garage door repair',
        category: data.category || 'General Care',
        content: parsed.content || '',
      });
    } catch (err) {
      console.error(`Error parsing markdown file ${filePath}:`, err);
    }
  }

  // Sort posts in reverse chronological order (newest date first)
  return posts.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeB - timeA;
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const posts = getAllPosts().filter((p) => p.slug !== currentSlug);
  const sameCategory = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  const otherPosts = posts.filter((p) => p.category.toLowerCase() !== category.toLowerCase());

  const combined = [...sameCategory, ...otherPosts];
  return combined.slice(0, limit);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map((p) => p.category);
  return Array.from(new Set(categories));
}
