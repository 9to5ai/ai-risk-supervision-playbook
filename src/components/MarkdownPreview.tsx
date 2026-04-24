interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return <pre className="markdown-preview">{markdown}</pre>;
}
