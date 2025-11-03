export const LOG = (value) => {
  if (!__DEV__) return; // Only log in development mode

  console.log(JSON.stringify(value, null, 2)); // pretty JSON format
};
