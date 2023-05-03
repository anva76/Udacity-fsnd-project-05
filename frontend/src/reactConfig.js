const config = {
  apiUrl: import.meta.env.VITE_API_SERVER_URL,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
}

export default config
