import { writable, type Writable } from 'svelte/store';

export const jsStatus: Writable<'enabled' | 'disabled'> = writable('disabled');
