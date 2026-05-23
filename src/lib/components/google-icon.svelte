<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/utils';

  let { class: className, ...restProps }: SVGAttributes<SVGElement> = $props();
</script>

<svg viewBox="0 0 24 24" class={cn('size-4', className)} aria-hidden="true" {...restProps}>
  <path
    d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.62 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.74 3.94 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.64-3.65 8.64-8.79 0-.59-.07-1.04-.16-1.51z"
    fill="currentColor"
  />
</svg>
