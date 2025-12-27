<script lang="ts">
  import { PUBLIC_BASE_URL } from '$env/static/public';

  const META_IMAGE_URL = 'https://res.cloudinary.com/nshemesh/image/upload/v1766678893/kumbaya/meta.png';

  interface Props {
    title: string;
    description: string;
    image: string;
    url: string;
  }

  let {
    title = $bindable(),
    description = $bindable('Light a Fire. Gather Around. Build Together.'),
    image = $bindable(META_IMAGE_URL),
    url = $bindable(PUBLIC_BASE_URL)
  }: Props = $props();

  let displayTitle = $derived(title ? `${title} | Kumbaya` : 'Kumbaya');
</script>

<svelte:head>
  <!-- Primary tags -->
  <title>{displayTitle}</title>
  <meta name="title" content={displayTitle} />
  <meta name="description" content={description} />
  <meta name="image" content={image} />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={displayTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={url} />
  <meta property="twitter:title" content={displayTitle} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />
</svelte:head>
