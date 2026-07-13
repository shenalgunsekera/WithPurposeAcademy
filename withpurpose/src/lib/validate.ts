/**
 * Sri Lankan NIC validation.
 * Old format: 9 digits followed by V or X (e.g. 923456789V)
 * New format: 12 digits (e.g. 199234567890)
 */
export function isValidNic(nic: string) {
  const v = nic.trim().toUpperCase();
  return /^\d{9}[VX]$/.test(v) || /^\d{12}$/.test(v);
}

export function normalizeNic(nic: string) {
  return nic.trim().toUpperCase();
}
