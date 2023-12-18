<script lang="ts">
  import { Heading, Hr, Html, Button } from 'svelte-email';
  export let url: string;
</script>

<Html lang="en">
  <Heading as="h1">Reset Your Password</Heading>
  <Button href={url}>Click here to reset your password</Button>
  <Hr />
</Html>
