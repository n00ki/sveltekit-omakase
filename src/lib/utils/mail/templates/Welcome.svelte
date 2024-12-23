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
        name: 'Oswald',
        href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap'
      }
    ]}
    styles={[
      {
        type: 'component',
        component: 'text',
        value: 'font-family="Oswald, Arial"'
      }
    ]}
  />
  <Body>
    <Section>
      <Column>
        <Text>
          <h2>Welcome to <span style="color: #f59e0b">SvelteKit Omakase</span></h2>
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
