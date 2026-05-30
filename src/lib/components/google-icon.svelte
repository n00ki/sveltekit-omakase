<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils';

  let { class: className, ...restProps }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg viewBox="0 0 24 24" class={cn('size-4', className)} aria-hidden="true" focusable="false" {...restProps}>
  <path
    fill="#4285f4"
    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.05 5.05 0 0 1-2.19 3.32v2.76h3.55c2.08-1.92 3.28-4.74 3.28-8.09z"
  />
  <path
    fill="#34a853"
    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.76c-.99.66-2.26 1.05-3.73 1.05-2.87 0-5.3-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
  />
  <path fill="#fbbc05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
  <path
    fill="#ea4335"
    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1a11 11 0 0 0-9.82 6.06L5.84 9.9C6.7 7.31 9.13 5.38 12 5.38z"
  />
</svg>
