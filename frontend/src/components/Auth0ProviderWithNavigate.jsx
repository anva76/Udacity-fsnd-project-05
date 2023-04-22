import { Auth0Provider } from "@auth0/auth0-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import config from "../reactConfig"

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/")
  }

  if (
    !(config.domain && config.clientId && config.callbackUrl && config.audience)
  ) {
    return null
  }

  return (
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      useRefreshTokens
      cacheLocation="localstorage"
      authorizationParams={{
        audience: config.audience,
        redirect_uri: config.callbackUrl,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
