<script lang="ts">
  import type { WithoutChild } from '$lib/utils/utils.js';

  import * as FormPrimitive from 'formsnap';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChild<FormPrimitive.DescriptionProps> = $props();
</script>

<FormPrimitive.Description
  bind:ref
  data-slot="form-description"
  class={cn('text-sm text-muted-foreground', className)}
  {...restProps}
/>
