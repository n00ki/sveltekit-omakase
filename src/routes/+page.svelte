<script>
  let { data } = $props();
</script>

<div class="grid flex-1 content-center justify-center text-center">
  <h1 class="my-2 text-3xl font-bold md:text-6xl">WELCOME</h1>

  {#if data.user}
    <div class="w-full rounded-md bg-primary p-2 text-center text-sm font-semibold text-primary-foreground md:text-xl">
      <p>{`${data.user.firstName} ${data.user.lastName}`}</p>
    </div>
  {/if}
</div>
