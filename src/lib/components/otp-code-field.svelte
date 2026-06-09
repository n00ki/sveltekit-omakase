<script lang="ts">
  import * as Field from '$components/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$components/ui/input-otp';

  type Props = {
    errors?: { message?: string }[];
    inputId: string;
    label?: string;
    pending?: boolean;
    value?: string;
  };

  let { errors, inputId, label, pending = false, value = $bindable('') }: Props = $props();
</script>

<Field.Field class="items-center gap-2 py-1">
  {#if label}
    <Field.Label class="text-xs font-medium tracking-tight text-muted-foreground">{label}</Field.Label>
  {/if}

  <InputOTP {inputId} bind:value maxlength={6} disabled={pending}>
    {#snippet children({ cells })}
      <InputOTPGroup>
        {#each cells as cell, index (index)}
          <InputOTPSlot {cell} />
        {/each}
      </InputOTPGroup>
    {/snippet}
  </InputOTP>

  <Field.Error {errors} />
</Field.Field>
