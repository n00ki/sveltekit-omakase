<script lang="ts">
  // Components
  import { Container, Button, Preview, Text, Head, Heading, Hr, Html, Link, Section } from 'svelty-email';

  export let url: string;
  export let invitedBy: string;

  const main = {
    backgroundColor: '#ffffff'
  };

  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px'
  };
</script>

<Html lang="en">
  <Head>
    <title>👥 You’re Invited to Collaborate on SvelteKit Omakase!</title>
    <meta name="description" content="👥 You’re Invited to Collaborate on SvelteKit Omakase!" />
  </Head>
  <Preview preview="{invitedBy} has invited you to join their team account on SvelteKit Omakase! 🥁" />
  <Container style={container}>
    <Section style={main}>
      <Heading as="h4">Hey! 👋</Heading>
      <Text>
        {invitedBy} has invited you to join their team account on SvelteKit Omakase! 🥁
      </Text>
      <Text>To get started, click the link below and accept the invitation:</Text>
      <Button href={url}>Click here to join</Button>
      <Hr />
      <Text>
        If you have any questions, feel free to <Link href="mailto:noams+hayde@hey.com">reach out</Link>
      </Text>
      <Text>Welcome aboard! 🎉</Text>
    </Section>
  </Container>
</Html>
