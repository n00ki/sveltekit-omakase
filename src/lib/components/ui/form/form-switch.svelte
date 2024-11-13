<script lang="ts">
  import { getFormField } from 'formsnap';
  import type { Switch as SwitchPrimitive } from 'bits-ui';
  import { Switch } from '$components/ui/switch';
  type $$Props = SwitchPrimitive.Props;
  type $$Events = SwitchPrimitive.Events;

  interface Props {
    onCheckedChange?: $$Props['onCheckedChange'];
    [key: string]: any;
  }

  let { onCheckedChange = undefined, ...rest }: Props = $props();

  const { name, setValue, attrStore, value } = getFormField();
</script>

<Switch
  {...$attrStore}
  checked={typeof $value === 'boolean' ? $value : false}
  onCheckedChange={(v) => {
    onCheckedChange?.(v);
    setValue(v);
  }}
  {...rest}
  on:click
  on:keydown
/>
<input hidden {name} value={$value} />
