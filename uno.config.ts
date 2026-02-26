import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography({
      cssExtend: {
        'blockquote p:first-of-type::before': {
          content: '""',
        },
        'blockquote p:last-of-type::after': {
          content: '""',
        },
      }
    }),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      base: {
        100: 'oklch(100% 0 0)',
        200: 'oklch(98% 0 0)',
        300: 'oklch(95% 0 0)',
        content: 'oklch(21% .006 285.885)',
      },
      primary: {
        50: '#f6f7f6',   // 晨雾白
        100: '#e3e9e3',  // 薄霭
        200: '#c7d8c7',  // 嫩叶尖
        300: '#a3c2a3',  // 芽绿
        400: '#7ba37b',  // 透光叶 ⭐
        500: '#5a825a',  // 苔绿（主色）✦
        DEFAULT: '#5a825a',
        600: '#466846',  // 深苔
        700: '#395239',  // 林荫
        800: '#2f422f',  // 密林
        900: '#283628',  // 树影
        950: '#141f14',  // 深夜林
      },
    }
  },
});
