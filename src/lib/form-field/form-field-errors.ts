export function getFormFieldDuplicatedHintError(align: string): Error {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}

export function getFormFieldMissingControlError(): Error {
  return Error('gh-form-field must contain a GhFormFieldControl.');
}
