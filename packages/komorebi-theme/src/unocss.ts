import {
  presetAttributify,
  presetTypography,
  presetWind4,
  transformerDirectives,
} from 'unocss';

export function createKomorebiUnoOptions(filesystem: string[]) {
  return {
    injectReset: true,
    content: {
      filesystem,
    },
    presets: [
      presetWind4(),
      presetAttributify(),
      presetTypography({
        cssExtend: {
          ':is(h2, h3, h4)[id]': {
            'scroll-margin-top': '7rem',
          },
          p: {
            'margin-top': '1.5rem',
            'margin-bottom': '1.5rem',
          },
          a: {
            color: 'rgb(244 63 94)',
            'font-weight': '500',
            'text-decoration': 'underline',
            'text-decoration-color': 'rgb(254 205 211)',
            'text-underline-offset': '0.25rem',
          },
          strong: {
            'font-weight': '600',
            color: 'rgb(24 24 27)',
          },
          em: {
            color: 'rgb(82 82 91)',
          },
          blockquote: {
            'margin-top': '2rem',
            'margin-bottom': '2rem',
            'border-inline-start-width': '4px',
            'border-inline-start-color': 'rgb(251 113 133)',
            'border-radius': '0 24px 24px 0',
            background: 'rgb(255 241 242 / 0.7)',
            padding: '1.25rem 1.5rem',
            'font-style': 'normal',
            'font-weight': '400',
            color: 'rgb(63 63 70)',
            quotes: 'none',
          },
          'blockquote p': {
            margin: '0',
          },
          'blockquote p:first-of-type::before': {
            content: 'none',
          },
          'blockquote p:last-of-type::after': {
            content: 'none',
          },
          h2: {
            'margin-top': '4rem',
            'margin-bottom': '1.5rem',
            'font-size': '2.25rem',
            'line-height': '1.1',
            'font-weight': '700',
            'letter-spacing': '-0.025em',
            color: 'rgb(9 9 11)',
          },
          h3: {
            'margin-top': '3rem',
            'margin-bottom': '1rem',
            'font-size': '1.5rem',
            'line-height': '1.25',
            'font-weight': '600',
            'letter-spacing': '-0.025em',
            color: 'rgb(9 9 11)',
          },
          h4: {
            'margin-top': '2.5rem',
            'margin-bottom': '0.75rem',
            'font-size': '1.25rem',
            'line-height': '1.4',
            'font-weight': '600',
            color: 'rgb(9 9 11)',
          },
          hr: {
            'margin-top': '3rem',
            'margin-bottom': '3rem',
            height: '1px',
            border: '0',
            background:
              'linear-gradient(90deg, rgb(228 228 231), rgb(212 212 216), transparent)',
          },
          img: {
            'margin-top': '2rem',
            'margin-bottom': '2rem',
            width: '100%',
            'border-radius': '24px',
            border: '1px solid rgb(228 228 231 / 0.7)',
            'box-shadow': '0 24px 60px -36px rgba(15, 23, 42, 0.35)',
          },
          ul: {
            'margin-top': '1.5rem',
            'margin-bottom': '1.5rem',
            'padding-left': '1.5rem',
            'list-style-type': 'disc',
          },
          ol: {
            'margin-top': '1.5rem',
            'margin-bottom': '1.5rem',
            'padding-left': '1.5rem',
            'list-style-type': 'decimal',
          },
          li: {
            'padding-left': '0.25rem',
          },
          'li + li': {
            'margin-top': '0.75rem',
          },
          'li > p:first-child:last-child': {
            margin: '0',
          },
          code: {
            'border-radius': '0.5rem',
            'background-color': 'rgb(244 244 245)',
            padding: '0.25rem 0.5rem',
            'font-size': '0.9em',
            'font-weight': '500',
            color: 'rgb(225 29 72)',
          },
          'code::before': {
            content: 'none',
          },
          'code::after': {
            content: 'none',
          },
          ':not(pre) > code': {
            'white-space': 'normal',
            'overflow-wrap': 'anywhere',
            'word-break': 'break-word',
            '-webkit-box-decoration-break': 'clone',
            'box-decoration-break': 'clone',
          },
          pre: {
            'margin-top': '2rem',
            'margin-bottom': '2rem',
            'overflow-x': 'auto',
            'border-radius': '24px',
            border: '1px solid rgb(228 228 231 / 0.8)',
            padding: '1.5rem',
            'font-size': '0.95rem',
            'line-height': '1.75rem',
            color: 'inherit',
            'background-color': 'transparent',
            'box-shadow': '0 20px 44px -34px rgba(15, 23, 42, 0.22)',
          },
          'pre code': {
            padding: '0',
            'background-color': 'transparent',
            'font-size': 'inherit',
            'font-weight': 'inherit',
            color: 'inherit',
          },
          table: {
            display: 'table',
            width: '100%',
            'min-width': '100%',
            'max-width': '100%',
            'table-layout': 'fixed',
            'border-collapse': 'separate',
            'border-spacing': '0',
            overflow: 'hidden',
            'margin-top': '2rem',
            'margin-bottom': '2rem',
            'border-radius': '20px',
            border: '1px solid rgb(228 228 231 / 0.8)',
            background: 'transparent',
          },
          thead: {
            'border-bottom-width': '0',
            background: 'transparent',
          },
          'tbody tr': {
            'border-bottom-width': '0',
          },
          tfoot: {
            'border-top-width': '0',
          },
          th: {
            background: 'rgb(250 250 250 / 0.9)',
            padding: '0.75rem 1rem',
            'text-align': 'left',
            'font-size': '0.875rem',
            'line-height': '1.75rem',
            'font-weight': '600',
            color: 'rgb(9 9 11)',
            'white-space': 'normal',
            'word-break': 'break-word',
          },
          td: {
            'border-top': '1px solid rgb(228 228 231 / 0.7)',
            background: 'rgb(255 255 255 / 0.8)',
            padding: '0.75rem 1rem',
            'font-size': '0.875rem',
            'line-height': '1.75rem',
            'white-space': 'normal',
            'word-break': 'break-word',
          },
        },
      }),
    ],
    transformers: [transformerDirectives()],
  };
}
