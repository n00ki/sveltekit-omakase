<script lang="ts">
  import type { WithElementRef } from '#lib/utils/utils.ts';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';

  import { cn } from '#lib/utils/utils.ts';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLFieldsetAttributes> = $props();
</script>

<fieldset
  bind:this={ref}
  data-slot="field-set"
  class={cn(
    'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</fieldset>
