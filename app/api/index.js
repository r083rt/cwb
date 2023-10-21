import axios from 'axios';
// const apiKey = 'Basic Y2FwdC5tbnM3N0BnbWFpbC5jb206MzI5YzQzNTM2MTcxMWM3Zg==';
const apiKey = 'Basic cnNqYW1zdWFyQGdtYWlsLmNvbTpmZjg3NGNlMWQ3NjAyNWNm';
const searchEngine = 'google';
const client = axios.create({
  baseURL: `https://api.dataforseo.com/v3/serp/google/organic/live/advanced`,
  headers: {
    Authorization: 'Basic ' + apiKey,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default client;
