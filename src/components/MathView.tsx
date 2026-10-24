import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  text?: string;
  display?: boolean;
  className?: string;
}

/**
 * MathView renders mathematical expressions using KaTeX.
 * Supports pure LaTeX strings or mixed text with $inline$ and $$display$$ delimiters.
 */
export const MathView: React.FC<MathViewProps> = ({ math, text, display = false, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (math) {
      try {
        return katex.renderToString(math, {
          displayMode: display,
          throwOnError: false,
        });
      } catch (err) {
        return `<span class="text-rose-500">${math}</span>`;
      }
    }

    if (text) {
      // Parse mixed text with $$...$$ and $...$
      // Replace $$ first
      let processed = text.replace(/\$\$([^$]+)\$\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          return `$$${equation}$$`;
        }
      });

      // Replace single $ for inline
      processed = processed.replace(/\$([^$]+)\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${equation}$`;
        }
      });

      return processed;
    }

    return '';
  }, [math, text, display]);

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
