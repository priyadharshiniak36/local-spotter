export const isEmailAddress = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isPhoneNumber = (value: string): boolean => {
  const normalized = value.replace(/\s+/g, "").replace(/[-()]/g, "");
  return /^\+?[0-9]{8,15}$/.test(normalized);
};

export const isValidIdentifier = (value: string): boolean => {
  const trimmed = value.trim();
  return Boolean(trimmed) && (isEmailAddress(trimmed) || isPhoneNumber(trimmed));
};

export const buildVerificationCode = (value: string): string => {
  const trimmed = value.trim();
  return trimmed.includes("@") ? "123456" : "654321";
};
