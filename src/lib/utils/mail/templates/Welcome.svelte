<script lang="ts">
  import { Html, Head, Body, Column, Section, Text } from 'sailkit';

  interface WelcomeEmailProps {
    userFirstName: string;
  }

  const { userFirstName }: WelcomeEmailProps = $props();
</script>

<Html>
  <Head
    subject="🥋 Welcome to SvelteKit Omakase!"
    preview="We are thrilled to have you onboard. ⭐"
    fonts={[
      {
        name: 'Outfit',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap'
      }
    ]}
  />
  <Body>
    <Section>
      <Column>
        <Text fontFamily="Outfit" paddingBottom="0px">
          <h1>Welcome to <span style="color: #f59e0b">SvelteKit Omakase</span></h1>
        </Text>
        <Text>
          <p>Hey, {userFirstName}!</p>
          <p>We're thrilled to have you onboard. ⭐</p>
        </Text>
        <Column.Divider />
        <Text>
          <p>Need help? we are just an <a href="https://mailto:noams+ks@hey.com">email</a> away.</p>
        </Text>
      </Column>
    </Section>
  </Body>
</Html>
