<script lang="ts">
  import ThemeTabs from '$components/theme-tabs.svelte';
</script>

<div class="flex w-full flex-1 flex-col justify-center gap-6">
  <header>
    <h3 class="mb-0.5 text-base font-medium">Appearance Settings</h3>
    <p class="text-xs tracking-tight text-muted-foreground">Customize the look and feel of your application</p>
  </header>

  <div class="space-y-4">
    <div class="space-y-1">
      <h4 class="text-sm font-medium">Theme</h4>
      <p class="text-xs text-muted-foreground">Choose your preferred color theme</p>
    </div>

    <ThemeTabs />
  </div>
</div>
