<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import type { WithoutChild } from '$lib/utils/utils.js';
  import type { FormPath } from 'sveltekit-superforms';

  import * as FormPrimitive from 'formsnap';

  import { cn } from '$lib/utils/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    form,
    name,
    ...restProps
  }: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props();
</script>

<FormPrimitive.Fieldset bind:ref {form} {name} class={cn('space-y-2', className)} {...restProps} />
