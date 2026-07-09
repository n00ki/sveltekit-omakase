type FormKey = string | number;

type KeyedRemoteForm = {
  for(key: FormKey): unknown;
};

type ScopedRemoteForm<TForm extends KeyedRemoteForm> = ReturnType<TForm['for']>;

/**
 * Uses keyed remote form instances until SvelteKit clears form state on navigation.
 * See https://github.com/sveltejs/kit/issues/14802
 */
export function useRemoteForm<TForm extends KeyedRemoteForm>(
  form: TForm,
  baseKey: FormKey,
  name?: FormKey
): ScopedRemoteForm<TForm> {
  const key: FormKey = name === undefined ? baseKey : `${baseKey}-${name}`;

  return form.for(key) as ScopedRemoteForm<TForm>;
}
