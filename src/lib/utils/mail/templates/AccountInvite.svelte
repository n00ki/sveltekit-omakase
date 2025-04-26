<script lang="ts">
  import { Html, Head, Body, Column, Section, Text } from 'sailkit';
  import { mailTheme } from './mailTheme';
  interface AccountInviteEmailProps {
    url: string;
    invitedBy: string;
  }

  const { url, invitedBy }: AccountInviteEmailProps = $props();
</script>

<Html>
  <Head
    subject="👥 You're Invited to Collaborate on SvelteKit Omakase!"
    preview="Join your team on SvelteKit Omakase"
    theme={mailTheme}
  />
  <Body>
    <Section>
      <Column>
        <Text paddingBottom="0px">
          <h1>
            `👥 You're Invited to Collaborate on `
            <span style="color: #f59e0b">SvelteKit Omakase</span>
          </h1>
        </Text>
        <Text>
          <p>Hey! 👋</p>
          <p>{invitedBy} has invited you to join their team account on SvelteKit Omakase! 🥁</p>
          <p>To get started, click the link below and accept the invitation:</p>
          <p>
            <a href={url}>Click here to join</a>
          </p>
        </Text>
        <Column.Divider />
        <Text>
          <p>
            If you have any questions, feel free to
            <a href="https://mailto:noams+sko@hey.com">reach out</a>.
          </p>
          <p>Welcome aboard! 🎉</p>
        </Text>
      </Column>
    </Section>
  </Body>
</Html>
