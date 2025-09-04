<script lang="ts">
  import SettingsNavbar from '$components/settings-navbar.svelte';
  import { Separator } from '$components/ui/separator';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const sidebarNavItems = [
    {
      title: 'Profile',
      href: '/settings/profile'
    },
    {
      title: 'Password',
      href: '/settings/password'
    },
    {
      title: 'Appearance',
      href: '/settings/appearance'
    }
  ];
</script>

<div class="px-4 py-6">
  <div class="space-y-0.5">
    <h2 class="text-xl font-semibold tracking-tight">Settings</h2>
    <p class="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
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
