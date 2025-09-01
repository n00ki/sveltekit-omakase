<script>
  import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
  <h1 class="my-2 text-2xl font-bold md:text-6xl">
    {page.status}: {page.error?.message}
  </h1>
  <p>
    <a href="/" class="text-base text-muted-foreground/80 hover:text-muted-foreground md:text-xl">Go back home</a>
  </p>
</div>
