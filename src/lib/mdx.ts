import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

export async function getMarkdownContent(fileName: string) {
  const filePath = path.join(process.cwd(), "content", fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { content, data } = matter(fileContents);

  const mdxSource = await serialize(content);

  return {
    mdxSource,
    frontMatter: data,
  };
}
