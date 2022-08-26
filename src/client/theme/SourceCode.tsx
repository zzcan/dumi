import React, { type FC } from 'react';
import type { Language } from 'prism-react-renderer';
import Highlight, { defaultProps } from 'prism-react-renderer';
import 'prismjs/themes/prism.css';

/**
 * define DSL which can be highlighted as similar language
 */
const SIMILAR_DSL = {
  acss: 'css',
  axml: 'xml',
};

export interface ICodeBlockProps {
  code: string;
  lang: Language;
}

export const SourceCode: FC<ICodeBlockProps> = ({ code, lang }) => {
  console.log('code---:', code)
  console.log('parseCode---:', JSON.parse(code))
  return (
    <div>
      <Highlight
        {...defaultProps}
        code={JSON.parse(code)}
        language={SIMILAR_DSL[lang] || lang}
        theme={undefined}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          console.log('tokens', tokens)
          return (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )
        }}
      </Highlight>
    </div>
  );
}
