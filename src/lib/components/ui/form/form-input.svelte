<script lang="ts">
  import { getFormField } from 'formsnap';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { Input, type InputEvents } from '$components/ui/input';
  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();

  type $$Props = HTMLInputAttributes;
  type $$Events = InputEvents;

  const { attrStore, value } = getFormField();
</script>

<Input
  {...$attrStore}
  bind:value={$value}
  {...rest}
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
/>
