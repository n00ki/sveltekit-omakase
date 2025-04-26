import { createTheme } from 'sailkit';

export const mailTheme = createTheme({
  fonts: [
    {
      name: 'Outfit',
      href: 'https://fonts.googleapis.com/css2?family=Outfit'
    }
  ],
  styles: {
    global: {
      fontFamily:
        'Outfit, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Helvetica, Arial, sans-serif'
    }
  }
});
