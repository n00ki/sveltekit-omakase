<script lang="ts">
  export let from: string;
  export let to: string;
  export let subject: string;
</script>

<div style="margin: 0 auto; padding: 20px 0; width: 580px;">
  <section style="background-color: #ffffff;">
    <h1>{subject}</h1>
    <p><strong>from:</strong> {from}</p>
    <p><strong>to:</strong> {to}</p>
  </section>
  <hr style="border-top: 3px solid #bbb;" />
</div>
