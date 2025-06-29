// Stubs para validaciones
export function hasRequiredFields(body: any): boolean {
  return !!(body.insuredId && body.countryISO && body.schedule);
}
export function isValidCountryISO(countryISO: string): boolean {
  return countryISO === 'PE' || countryISO === 'CL';
}
