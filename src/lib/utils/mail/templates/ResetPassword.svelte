<script lang="ts">
  // Components
  import { Container, Preview, Head, Link, Heading, Text, Hr, Html, Button, Section } from 'svelty-email';

  export let userFirstName: string;
  export let url: string;

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
    <title>🔒 Reset Your Password</title>
    <meta name="description" content="🔒 Reset Your Password" />
  </Head>
  <Preview preview="It looks like you requested a password reset. No worries, we’ve got you covered!" />
  <Container style={container}>
    <Section style={main}>
      <Heading as="h1">🔒 Reset Your Password</Heading>
      <Text>Hey, {userFirstName}!</Text>
      <Text>It looks like you requested a password reset. No worries, we’ve got you covered!</Text>
      <Text>Click the link below to reset your password:</Text>
      <Button href={url}>Reset Your Password</Button>
      <Hr />
      <Text
        >If you didn’t request this, please ignore this email or <Link href="mailto:noams+ks@hey.com">contact us</Link>
      </Text>
      <Text>Stay secure 🛟</Text>
    </Section>
  </Container>
</Html>
