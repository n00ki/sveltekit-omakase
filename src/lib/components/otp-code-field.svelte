<script lang="ts">
  import * as Field from '#components/ui/field/index.ts';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '#components/ui/input-otp/index.ts';

  type Props = {
    errors?: { message?: string }[];
    inputId: string;
    pending?: boolean;
    value?: string;
  };

  let { errors, inputId, pending = false, value = $bindable('') }: Props = $props();

  const invalid = $derived(!!errors?.length);
</script>

<Field.Field class="items-center gap-2 py-1">
  <Field.Label for={inputId} class="sr-only">Authentication code</Field.Label>

  <InputOTP
    {inputId}
    bind:value
    maxlength={6}
    disabled={pending}
    aria-invalid={invalid}
    class="justify-center"
    {@attach (node) => {
      if (!pending) node.focus();
    }}
  >
    {#snippet children({ cells })}
      <InputOTPGroup>
        {#each cells as cell, index (index)}
          <InputOTPSlot {cell} aria-invalid={invalid} class="size-9" />
        {/each}
      </InputOTPGroup>
    {/snippet}
  </InputOTP>

  <Field.Error {errors} />
</Field.Field>
