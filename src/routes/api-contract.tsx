import fs from 'node:fs'
import path from 'node:path'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const getApiContract = createServerFn({ method: 'GET' }).handler(async () => {
  const filePath = path.resolve(process.cwd(), 'docs', 'API_CONTRACT.md')
  return await fs.promises.readFile(filePath, 'utf-8')
})

export const Route = createFileRoute('/api-contract')({
  component: ApiContractPage,
  loader: async () => await getApiContract(),
})

const components: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    )
  },
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-border">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-foreground mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 text-muted-foreground space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  hr: () => <hr className="my-6 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
      {children}
    </blockquote>
  ),
}

function ApiContractPage() {
  const markdown = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">
            API Contract
          </h1>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Backend Reference
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {markdown}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  )
}
