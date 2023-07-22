export const getFormattedContactNumber = (contactNumber: string) => {
  const VALID_NUMBER_REGEX = /^(?:\+91|91)?[6-9]\d{9}$/;
  if (!VALID_NUMBER_REGEX.test(contactNumber)) throw new Error('invalid contact number');

  if (contactNumber.length === 10) return '+91' + contactNumber;
  if (contactNumber.length === 12 && contactNumber.startsWith('91')) return '+' + contactNumber;

  return contactNumber;
};
