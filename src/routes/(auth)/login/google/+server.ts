import { auth } from '$lib/server/auth';

export async function GET(): Promise<Response> {
  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: 'google'
      }
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: response.url?.toString() ?? '/login'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
      headers: {
        Location: '/login'
      }
    });
  }
}
