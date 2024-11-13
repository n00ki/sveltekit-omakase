<script lang="ts">
  import { getFormField } from 'formsnap';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import type { TextareaGetFormField } from '.';
  import { Textarea, type TextareaEvents } from '$components/ui/textarea';
  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();

  type $$Props = HTMLTextareaAttributes;
  type $$Events = TextareaEvents;

  const { attrStore, value } = getFormField() as TextareaGetFormField;
</script>

<Textarea
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
