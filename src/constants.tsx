// Constants.js
let BASE_URL: string;
if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://us-central1-calendar-buddy-bfdf1.cloudfunctions.net";
} else if (process.env.NODE_ENV === "test") {
  // for testing
} else {
  BASE_URL = "http://127.0.0.1:5001/calendar-buddy-bfdf1/us-central1";
}

// APIs
const EVENT_CREATE = `/createEvent`;
const SIGNUP = "/signup";
const LOGIN = "/login";
const EVENT_LIST = "/listEvent";
const generateEndpoint = (endpoint: string) => `${BASE_URL}${endpoint}`;
export const APIs = {
  EVENT_CREATE: generateEndpoint(EVENT_CREATE),
  SIGNUP: generateEndpoint(SIGNUP),
  LOGIN: generateEndpoint(LOGIN),
  EVENT_LIST: generateEndpoint(EVENT_LIST),
};

export const config = {
  apis: {
    ...APIs,
  },
};

// When you run npm start, it is always equal to 'development',
// when you run npm test it is always equal to 'test',
// and when you run npm run build to make a production bundle, it is always equal to 'production'
