<script lang="ts">
  // Components
  import SettingsNavbar from '$components/SettingsNavbar.svelte';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { Separator } from '$components/ui/separator';

  const sidebarNavItems = [
    {
      title: 'User Profile',
      href: '/settings/profile'
    },
    {
      title: 'Team Accounts',
      href: '/settings/accounts'
    }
  ];
</script>

<div class="space-y-6 pb-16 md:block md:p-10">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Settings</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
    <p class="text-muted-foreground">Manage your profile and team accounts.</p>
  </div>
  <Separator class="my-6" />
  <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <aside class="-mx-4 lg:w-1/5">
      <SettingsNavbar items={sidebarNavItems} />
    </aside>
    <div class="flex-1 lg:max-w-2xl">
      <slot />
    </div>
  </div>
</div>
