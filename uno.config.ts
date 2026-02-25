import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWind4,
  transformerDirectives
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
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
    }
  },
});
