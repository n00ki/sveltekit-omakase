<script lang="ts">
  // Components
  import SettingsNavbar from '$components/SettingsNavbar.svelte';
  import { Separator } from '$components/ui/separator';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const sidebarNavItems = [
    {
      title: 'User Profile',
      href: '/settings/profile'
    },
    {
      title: 'Teams',
      href: '/settings/teams'
    }
  ];
</script>

<div class="px-4 py-6">
  <div class="space-y-0.5">
    <h2 class="text-xl font-semibold tracking-tight">Settings</h2>
    <p class="text-muted-foreground text-sm">Manage your profile and teams.</p>
  </div>
  <Separator class="my-6" />
  <div class="flex flex-col space-y-8 md:space-y-0 lg:flex-row lg:space-y-0 lg:space-x-12">
    <aside class="w-full max-w-xl lg:w-48">
      <SettingsNavbar items={sidebarNavItems} />
    </aside>

    <Separator class="my-6 md:hidden" />

    <div class="flex-1 md:max-w-2xl">
      <section class="max-w-xl">
        {@render children?.()}
      </section>
    </div>
  </div>
</div>
