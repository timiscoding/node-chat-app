export const isRealString = string => {
  return typeof string === 'string' && string.trim().length > 0;
};
