<script lang="ts">
  import { jsStatus } from '$lib/stores/js_status';

  let state = false;

  export let type: 'text' | 'avatar' = 'text';

  const handleState = () => {
    state = !state;
  };

  const handleFocusLost = ({ relatedTarget, currentTarget }: FocusEvent) => {
    // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
    if (
      relatedTarget instanceof HTMLElement &&
      (currentTarget as HTMLDivElement).contains(relatedTarget)
    )
      return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
    state = false;
  };
</script>

<div on:focusout={handleFocusLost} role="menu" class="dropdown-end dropdown">
  <span
    role="button"
    on:click={handleState}
    on:keydown={(e) => {
      if (e.key === 'Enter') handleState();
    }}
    tabindex="0"
    aria-haspopup="true"
    aria-expanded={state}
    class="btn-ghost btn focus:bg-neutral mx-1 {type === 'avatar' && 'btn-circle avatar'}"
  >
    <slot name="trigger" />
  </span>

  {#if $jsStatus === 'enabled' && state}
    <ul
      id="menu-dropdown"
      class="dropdown-content menu rounded-box bg-base-200 mt-4 w-52 p-2 shadow-md"
    >
      <slot name="items" />
    </ul>
  {/if}
</div>
