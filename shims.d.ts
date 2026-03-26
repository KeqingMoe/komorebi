import type { AttributifyAttributes } from '@unocss/preset-attributify';

type VariantPrefixes =
  | 'print'
  | 'prose'
  | 'tracking'
  | 'leading'
  | 'md' // for md:hidden
  ;
type UtilityNames = 'hidden' | 'block';

type Variants = {
  [K in VariantPrefixes | `${VariantPrefixes}:${UtilityNames}`]?: boolean | string;
};

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes, Variants { }
  }
}
