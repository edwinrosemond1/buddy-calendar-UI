export const CLOUD_FUNCTION_DOMAIN =
  typeof process.env.REACT_APP_BASE_URL === "undefined"
    ? "https://us-central1-calendar-buddy-bfdf1.cloudfunctions.net"
    : process.env.REACT_APP_BASE_URL;
