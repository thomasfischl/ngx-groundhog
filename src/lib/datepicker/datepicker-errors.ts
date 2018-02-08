export function createMissingDateImplError(provider: string) {
  return Error(
      `GhDatepicker: No provider found for ${provider}. You must import one of the following ` +
      `modules at your application root: GhNativeDateModule, or provide a custom implementation.`);
}
