type ValidatableForm = {
  validate: (opts: { preflightOnly: boolean }) => Promise<void>;
  fields: { allIssues(): Array<{ message: string }> | undefined };
};

/**
 * Validates on focusout, then re-validates on input only while errors exist.
 * This clears errors as soon as the user fixes them without creating
 * premature validation noise on pristine or valid fields.
 */
export function useFormValidation(form: ValidatableForm) {
  let hasErrors = $state(false);

  async function validate() {
    await form.validate({ preflightOnly: true });
    hasErrors = (form.fields.allIssues() ?? []).length > 0;
  }

  return {
    onfocusout: () => validate(),
    oninput: () => {
      if (!hasErrors) return;
      validate();
    }
  };
}
