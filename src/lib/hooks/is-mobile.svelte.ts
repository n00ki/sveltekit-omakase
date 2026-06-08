import { MediaQuery } from 'svelte/reactivity';

import { config } from '$config';

export class IsMobile extends MediaQuery {
  constructor(breakpoint: number = config.ui.mobileBreakpoint) {
    super(`max-width: ${breakpoint - 1}px`);
  }
}
