<script lang="ts">
  import { confirmTwoFactorSetup } from '$remote/two-factor.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { useRemoteForm } from '$lib/hooks/use-remote-form';
  import { confirmTwoFactorSetupSchema } from '$lib/validations/auth';

  import OtpCodeField from '$components/otp-code-field.svelte';
  import { Button, buttonVariants } from '$components/ui/button';
  import * as Dialog from '$components/ui/dialog';

  import { Check, Copy, RotateCw, ScanLine } from '@lucide/svelte';

  type Setup = {
    manualSetupKey: string;
    qrCodeSvg: string;
  };

  let {
    open = $bindable(false),
    onOpenChange,
    setup
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    setup: Setup | null;
  } = $props();

  const formKey = $props.id();
  const confirmForm = useRemoteForm(confirmTwoFactorSetup, formKey).preflight(confirmTwoFactorSetupSchema);
  let code = $state('');
  let copied = $state(false);
  let step = $state<'scan' | 'verify'>('scan');

  const gridCells = [0, 1, 2, 3, 4];
  const qrCodeDataUrl = $derived(setup ? `data:image/svg+xml;utf8,${encodeURIComponent(setup.qrCodeSvg)}` : '');
  const manualSetupKey = $derived(setup?.manualSetupKey.match(/.{1,4}/g)?.join(' ') ?? '');
  const title = $derived(step === 'verify' ? 'Verify Authentication Code' : 'Enable Two-Factor Authentication');
  const description = $derived.by(() => {
    if (step === 'verify') return 'Enter the 6-digit code from your authenticator app.';
    return 'To enable two-factor authentication, scan the QR code or enter the setup key in your authenticator app.';
  });

  async function copySetupKey() {
    if (!setup?.manualSetupKey) return;

    await navigator.clipboard.writeText(setup.manualSetupKey);
    copied = true;
    window.setTimeout(() => (copied = false), 2000);
  }

  function continueToVerification() {
    step = 'verify';
  }

  function resetModalState() {
    copied = false;
    code = '';
    step = 'scan';
  }

  function handleOpenChange(nextOpen: boolean) {
    open = nextOpen;
    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      resetModalState();
    }
  }
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <div class="flex flex-col items-center justify-center">
      <div class="mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm">
        <div class="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
          <div class="absolute inset-0 grid grid-cols-5 opacity-50">
            {#each gridCells as gridCell (gridCell)}
              <div class="border-r border-border last:border-r-0"></div>
            {/each}
          </div>
          <div class="absolute inset-0 grid grid-rows-5 opacity-50">
            {#each gridCells as gridCell (gridCell)}
              <div class="border-b border-border last:border-b-0"></div>
            {/each}
          </div>
          <ScanLine class="relative z-20 size-6 text-foreground" />
        </div>
      </div>

      <div class="my-3 space-y-1 text-center">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </div>
    </div>

    {#if setup}
      <div class="relative flex flex-col items-center justify-center space-y-5">
        {#if step === 'verify'}
          <form {...confirmForm} {...useFormValidation(confirmForm)} class="w-full space-y-4!">
            <input {...confirmForm.fields._code.as('hidden', code)} />

            <OtpCodeField
              inputId="setup-two-factor-code"
              bind:value={code}
              pending={!!confirmForm.pending}
              errors={confirmForm.fields._code.issues()}
            />

            <div class="flex gap-3">
              <Button
                type="button"
                variant="outline"
                class="flex-1"
                disabled={!!confirmForm.pending}
                onclick={() => (step = 'scan')}
              >
                Back
              </Button>
              <button
                type="submit"
                disabled={!!confirmForm.pending || code.length < 6}
                class={buttonVariants({ class: 'flex-1 gap-1.5' })}
              >
                {#if confirmForm.pending}
                  <RotateCw size="14" class="animate-spin" />
                {/if}
                Confirm
              </button>
            </div>
          </form>
        {:else}
          <div class="mx-auto aspect-square w-64 overflow-hidden rounded-lg border border-border bg-white p-5">
            <img src={qrCodeDataUrl} alt="Two-factor authentication QR code" class="size-full" />
          </div>

          <button type="button" class={buttonVariants({ class: 'w-full' })} onclick={continueToVerification}>
            Continue
          </button>

          <div class="relative flex w-full items-center justify-center text-xs text-muted-foreground">
            <div class="absolute inset-x-0 top-1/2 h-px bg-border"></div>
            <span class="relative bg-popover px-2">or, enter the code manually</span>
          </div>

          <div class="flex w-full overflow-hidden rounded-lg border border-border bg-background">
            <code class="min-w-0 flex-1 break-all px-3 py-2 font-mono text-xs leading-5">{manualSetupKey}</code>
            <button
              type="button"
              class="flex w-10 shrink-0 items-center justify-center border-l border-border hover:bg-muted"
              aria-label="Copy setup key"
              onclick={copySetupKey}
            >
              {#if copied}
                <Check class="size-4 text-green-600" />
              {:else}
                <Copy class="size-4" />
              {/if}
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
