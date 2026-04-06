<script lang="ts">
  import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text
  } from '@better-svelte-email/components';

  interface ResetPasswordEmailProps {
    userFirstName: string;
    url: string;
  }

  const { userFirstName, url }: ResetPasswordEmailProps = $props();
</script>

<Html>
  <Head />
  <Body class="m-0 bg-zinc-800 px-4 py-8 font-sans">
    <Preview preview="Reset your password securely with this link." />
    <Container class="max-w-[600px] rounded-3xl bg-slate-100 px-8 py-10">
      <Section>
        <Heading as="h1" class="m-0 text-[30px] leading-[1.2] font-bold text-slate-900">Reset Your Password</Heading>
        <Text class="mt-6 mb-0 text-base leading-[1.7] text-slate-700">Hey, {userFirstName}!</Text>
        <Text class="mt-3 mb-0 text-base leading-[1.7] text-slate-700">
          It looks like you requested a password reset. Click the button below to choose a new password.
        </Text>
        <Section class="mt-8">
          <Button
            href={url}
            pX={24}
            pY={14}
            class="rounded-xl bg-slate-900 text-sm font-semibold text-white no-underline"
          >
            Reset Your Password
          </Button>
        </Section>
        <Text class="mt-5 mb-0 text-sm leading-[1.7] text-slate-600">
          If the button does not work, copy and paste this link into your browser:
        </Text>
        <Text class="mt-2 mb-0 text-sm leading-[1.7] break-all text-slate-900">
          <Link href={url} class="text-slate-900 underline">{url}</Link>
        </Text>
        <Hr class="my-8 border-slate-200" />
        <Text class="m-0 text-sm leading-[1.7] text-slate-600"
          >If you didn't request this, please ignore this email.</Text
        >
      </Section>
    </Container>
  </Body>
</Html>
