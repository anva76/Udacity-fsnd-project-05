// This component is based on examples provided by Auth0.com
//
import { withAuthenticationRequired } from "@auth0/auth0-react"
import React from "react"
import PageLoader from "./PageLoader"

export const Auth0RouteGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <PageLoader />,
  })

  return <Component />
}
