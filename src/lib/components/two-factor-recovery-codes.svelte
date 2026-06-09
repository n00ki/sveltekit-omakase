<script lang="ts">
  import { getTwoFactorRecoveryCodes, regenerateTwoFactorRecoveryCodes } from '$remote/two-factor.remote';

  import { buttonVariants } from '$components/ui/button';
  import * as Card from '$components/ui/card';

  import { Eye, EyeOff, LockKeyhole, RefreshCw } from '@lucide/svelte';

  const formId = $props.id();
  const regenerateForm = regenerateTwoFactorRecoveryCodes.for(formId);
  const skeletonRows = [0, 1, 2, 3, 4, 5, 6, 7];

  let recoveryCodes = $state<string[]>([]);
  let loading = $state(false);
  let visible = $state(false);

  async function loadRecoveryCodes() {
    loading = true;

    try {
      recoveryCodes = await getTwoFactorRecoveryCodes();
    } finally {
      loading = false;
    }
  }

  async function toggleRecoveryCodes() {
    if (!visible && recoveryCodes.length === 0) {
      await loadRecoveryCodes();
    }

    visible = !visible;
  }

  const enhancedRegenerateForm = regenerateForm.enhance(async (form) => {
    const successful = await form.submit();

    if (!successful) return;

    recoveryCodes = regenerateForm.result?.recoveryCodes ?? [];
    visible = true;
  });
</script>

<Card.Root class="w-full rounded-lg">
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-sm">
      <LockKeyhole class="size-4" />
      2FA Recovery Codes
    </Card.Title>
    <Card.Description>Recovery codes let you regain access if you lose your authenticator device.</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" class={buttonVariants({ class: 'w-fit gap-2' })} onclick={toggleRecoveryCodes}>
        {#if visible}
          <EyeOff class="size-4" />
        {:else}
          <Eye class="size-4" />
        {/if}
        {visible ? 'Hide' : 'View'} Recovery Codes
      </button>

      {#if visible && !loading}
        <form {...regenerateForm} {...enhancedRegenerateForm}>
          <button
            type="submit"
            disabled={!!regenerateForm.pending}
            class={buttonVariants({ variant: 'secondary', class: 'w-fit gap-2' })}
          >
            <RefreshCw class={regenerateForm.pending ? 'size-4 animate-spin' : 'size-4'} />
            Regenerate Codes
          </button>
        </form>
      {/if}
    </div>

    {#if visible}
      <div class="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm select-text">
        {#if loading}
          {#each skeletonRows as skeletonRow (skeletonRow)}
            <div class="h-4 animate-pulse rounded bg-muted-foreground/20"></div>
          {/each}
        {:else}
          {#if recoveryCodes.length}
            {#each recoveryCodes as recoveryCode, index (index)}
              <div>{recoveryCode}</div>
            {/each}
          {:else}
            <p class="font-sans text-sm text-muted-foreground">No recovery codes remain.</p>
          {/if}
        {/if}
      </div>
      <p class="text-xs text-muted-foreground select-none">
        Each recovery code can be used once. Store them in a password manager.
      </p>
    {/if}
  </Card.Content>
</Card.Root>
