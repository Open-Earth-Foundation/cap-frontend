import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function MarkdownRenderer({ markdownContent }) {
const components = {
    h1: ({ node, children, ...props }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 font-poppins" {...props}>
        {children}
      </h1>
    ),
    h2: ({ node, children, ...props }) => (
      <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4 border-b-2 border-blue-100 pb-3 font-poppins" {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }) => (
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3 font-poppins" {...props}>
        {children}
      </h3>
    ),
    p: ({ node, children, ...props }) => (
      <p className="text-gray-600 leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ node, children, ...props }) => (
      <ul className="list-disc pl-5 mb-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ node, children, ...props }) => (
      <ol className="list-decimal pl-5 mb-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }) => (
      <li className="text-gray-600 mb-2 leading-normal" {...props}>
        {children}
      </li>
    ),
    strong: ({ node, children, ...props }) => (
      <strong className="text-gray-700 font-semibold" {...props}>
        {children}
      </strong>
    ),
    em: ({ node, children, ...props }) => (
      <em className="text-gray-600 italic" {...props}>
        {children}
      </em>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ node, children, ...props }) => (
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    ),
    th: ({ node, children, ...props }) => (
      <th className="border border-gray-300 bg-gray-50 p-2 text-left" {...props}>
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td className="border border-gray-300 p-2" {...props}>
        {children}
      </td>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter language={match[1]} {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  // Parse and render the markdown with explicit components
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkParse]}
        rehypePlugins={[rehypeRaw]}
      >
        {markdownContent}
      </ReactMarkdown>

    </div>
  );
}
