interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="prose-article text-text-secondary"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
