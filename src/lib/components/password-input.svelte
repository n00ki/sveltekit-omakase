<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import EyeIcon from '@lucide/svelte/icons/eye';
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import { tick } from 'svelte';

  import { cn } from '$lib/utils/utils.js';

  import Input from '$components/ui/input/input.svelte';

  type Props = Omit<ComponentProps<typeof Input>, 'ref' | 'files'> & {
    ref?: HTMLInputElement | null;
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
    passwordShownAnnouncement?: string;
    passwordHiddenAnnouncement?: string;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    disabled = false,
    autocapitalize = 'none',
    autocorrect = 'off',
    spellcheck = false,
    showPasswordLabel = 'Show password',
    hidePasswordLabel = 'Hide password',
    passwordShownAnnouncement = 'Your password is visible',
    passwordHiddenAnnouncement = 'Your password is hidden',
    ...inputProps
  }: Props = $props();

  let visible = $state(false);
  let announcement = $state('');

  function keepInputFocus(event: PointerEvent): void {
    event.preventDefault();
  }

  async function toggleVisibility(): Promise<void> {
    if (disabled) {
      return;
    }

    const input = ref;
    const selection =
      input && document.activeElement === input
        ? {
            start: input.selectionStart,
            end: input.selectionEnd,
            direction: input.selectionDirection
          }
        : null;

    visible = !visible;
    announcement = visible ? passwordShownAnnouncement : passwordHiddenAnnouncement;

    if (!selection) {
      return;
    }

    await tick();

    if (!ref) {
      return;
    }

    ref.focus({ preventScroll: true });

    if (selection.start !== null && selection.end !== null) {
      ref.setSelectionRange(selection.start, selection.end, selection.direction ?? undefined);
    }
  }
</script>

<div data-slot="password-input" class="relative">
  <Input
    {...inputProps}
    bind:ref
    bind:value
    type={visible ? 'text' : 'password'}
    class={cn('pr-10 font-sans', className)}
    {disabled}
    {autocapitalize}
    {autocorrect}
    {spellcheck}
  />

  <button
    data-slot="password-toggle"
    type="button"
    class="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-md px-3 text-muted-foreground transition-[color,box-shadow] outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
    aria-label={visible ? hidePasswordLabel : showPasswordLabel}
    {disabled}
    onpointerdown={keepInputFocus}
    onclick={toggleVisibility}
  >
    {#if visible}
      <EyeOffIcon class="size-4" aria-hidden="true" />
    {:else}
      <EyeIcon class="size-4" aria-hidden="true" />
    {/if}
  </button>

  <span class="sr-only" aria-live="polite" aria-atomic="true">
    {announcement}
  </span>
</div>
