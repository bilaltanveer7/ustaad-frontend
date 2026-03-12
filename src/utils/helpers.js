/**
 * Capitalizes the first letter of a string.
 * @param {string} value
 * @returns {string}
 */
export const capitalize = (value) => {
  if (value === null || value === undefined) return "N/A";
  const str = String(value);
  console.log("str", str);
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalizes each element in an array and joins them with a separator.
 * @param {string[]} arr
 * @param {string} separator
 * @returns {string}
 */
export const formatArray = (arr, separator = ", ") => {
  if (!Array.isArray(arr) || arr.length === 0) return "N/A";
  return arr.map((item) => capitalize(item)).join(separator);
};
