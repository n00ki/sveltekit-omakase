<script>
  // Stores
  import { page } from '$app/stores';
</script>

<div class="flex flex-1 flex-col items-center justify-center">
  <h1 class="my-2 text-3xl font-bold md:text-6xl">WELCOME</h1>
  <h1 class="my-2 text-2xl font-bold md:text-6xl">
    {$page.data.user ? $page.data.user.email : ''}
  </h1>
</div>
