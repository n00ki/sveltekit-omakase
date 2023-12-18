import { tv, type VariantProps } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
  base: 'relative w-full rounded-lg px-6 py-3 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-primary-foreground',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground [&>svg]:text-destructive-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
  Root,
  Description,
  Title,
  //
  Root as Alert,
  Description as AlertDescription,
  Title as AlertTitle
};
