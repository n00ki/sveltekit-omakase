<script>
  export let data;
</script>

<div class="grid flex-1 content-center justify-center text-center">
  <h1 class="my-2 text-3xl font-bold md:text-6xl">WELCOME</h1>

  {#if data.user}
    <div class="bg-primary text-primary-foreground w-full rounded-md p-2 text-center text-sm font-semibold md:text-xl">
      <p>{data.user ? data.user.email : ''}</p>
    </div>
  {/if}
</div>
