<script lang="ts">
  import * as Select from '$components/ui/select';
  import { getFormField } from 'formsnap';
  import type { Select as SelectPrimitive } from 'bits-ui';

  type $$Props = SelectPrimitive.Props<unknown>;
  const { setValue, name, value } = getFormField();
  interface Props {
    onSelectedChange?: $$Props['onSelectedChange'];
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { onSelectedChange = undefined, children, ...rest }: Props = $props();
</script>

<Select.Root
  onSelectedChange={(v) => {
    onSelectedChange?.(v);
    setValue(v ? v.value : undefined);
  }}
  {...rest}
>
  {@render children?.()}
  <input hidden {name} value={$value} />
</Select.Root>
