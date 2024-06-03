<script lang="ts">
  // Components
  import { Container, Preview, Head, Heading, Link, Hr, Html, Section, Text } from 'svelty-email';

  export let userFirstName: string;

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
    <title>🥋 Welcome to SvelteKit Omakase!</title>
    <meta name="description" content="🥋 Welcome to SvelteKit Omakase!" />
  </Head>
  <Preview preview="{userFirstName}, Welcome to SvelteKit Omakase!" />
  <Container style={container}>
    <Section style={main}>
      <Heading as="h1">Welcome to SvelteKit Omakase!</Heading>
      <Text>Hey, {userFirstName}!</Text>
      <Text>We’re thrilled to have you on board. 🌟</Text>
      <Hr />
      <Text>
        Need help? We are just an <Link href="mailto:noams+ks@hey.com">email</Link> away.
      </Text>
    </Section>
  </Container>
</Html>
