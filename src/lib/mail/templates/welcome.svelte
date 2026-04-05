<script lang="ts">
  import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@better-svelte-email/components';

  interface WelcomeEmailProps {
    userFirstName: string;
  }

  const { userFirstName }: WelcomeEmailProps = $props();
</script>

<Html>
  <Head />
  <Body class="m-0 bg-stone-800 px-4 py-8 font-sans">
    <Preview preview="We are thrilled to have you onboard. ⭐" />
    <Container class="max-w-[600px] rounded-3xl bg-slate-100 px-8 py-10">
      <Section>
        <Heading as="h1" class="m-0 text-[30px] leading-[1.2] font-bold text-slate-900">
          Welcome to <span class="text-amber-500">SvelteKit Omakase</span>
        </Heading>
        <Text class="mt-6 mb-0 text-base leading-[1.7] text-slate-700">Hey, {userFirstName}!</Text>
        <Text class="mt-3 mb-0 text-base leading-[1.7] text-slate-700">
          We're thrilled to have you onboard and can't wait to see what you build.
        </Text>
        <Hr class="my-8 border-slate-200" />
        <Text class="m-0 text-sm leading-[1.7] text-slate-600"
          >Need help? Reply to this email and we'll take a look.</Text
        >
      </Section>
    </Container>
  </Body>
</Html>
