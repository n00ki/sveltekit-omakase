<script>
  // Stores
  import { page } from '$app/stores';
</script>

<div class="flex flex-1 flex-col items-center justify-center">
  <h1 class="my-2 text-6xl font-bold">
    {$page.status}: {$page.error?.message}
  </h1>
  <p>
    <a href="/" class="text-slate-600 hover:text-slate-700">Go back home</a>
  </p>
</div>
