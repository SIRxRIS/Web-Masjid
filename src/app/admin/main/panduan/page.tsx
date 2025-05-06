import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/panduan/site-header";
import fs from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page() {
  const filePath = path.join(process.cwd(), "public", "panduan", "panduan.md");
  const fileContent = await fs.readFile(filePath, "utf-8");

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="max-w-3xl mx-auto p-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-400" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-4 text-gray-600 dark:text-gray-400" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-4 text-gray-600 dark:text-gray-400" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4 overflow-x-auto text-sm" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" {...props} />
              ),
            }}
          >
            {fileContent}
          </ReactMarkdown>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}