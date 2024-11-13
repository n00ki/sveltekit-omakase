<script lang="ts">
  import { getFormField } from 'formsnap';
  import type { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
  import * as RadioGroup from '$components/ui/radio-group';

  type $$Props = RadioGroupPrimitive.Props;
  const { attrStore, setValue, name, value } = getFormField();

  interface Props {
    onValueChange?: $$Props['onValueChange'];
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { onValueChange = undefined, children, ...rest }: Props = $props();
</script>

<RadioGroup.Root
  {...$attrStore}
  onValueChange={(v) => {
    onValueChange?.(v);
    setValue(v);
  }}
  {...rest}
>
  {@render children?.()}
  <input hidden {name} value={$value} />
</RadioGroup.Root>
