import type { Root } from 'hast';
import type { Transformer } from 'unified';

let visit: typeof import('unist-util-visit').visit;
let SKIP: typeof import('unist-util-visit').SKIP;
let toString: typeof import('mdast-util-to-string').toString;

(async () => {
  ({ visit, SKIP } = await import('unist-util-visit'));
  ({ toString } = await import('mdast-util-to-string'));
})();

function createSourceCode(lang: string, code: string, position: any) {
  return {
    type: 'element',
    tagName: 'SourceCode',
    position,
    properties: {
      code: JSON.stringify(code),
      lang: lang || 'unknown',
    },
  };
}

export default function rehypeEnhancedTag(): Transformer<Root> {
  return (tree) => {
    visit<Root, 'element'>(tree, 'element', (node, i, parent) => {
      console.log('node---:', node)
      if (node.tagName === 'pre') {
        const codeNode = node.children?.[0];
        console.log('codeNode---:', codeNode)
        // code block
        if(codeNode?.type === 'element' && codeNode?.tagName === 'code') {
          const cls = codeNode.properties?.className || [];
          const lang = Array.isArray(cls) ? String(cls[0]).replace('language-', '') : '';
          const code = toString(codeNode.children).trim();

          parent?.children.splice(
            i,
            1,
            createSourceCode(lang, code, node.position),
          );

          return SKIP;
        }

        // <pre>
        if(codeNode) {
          const code = toString(codeNode).trim();
          parent?.children.splice(
            i,
            1,
            createSourceCode('', code, node.position),
          );
        }
      }

    })
  }
}
