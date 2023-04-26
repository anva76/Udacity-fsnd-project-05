import { createGlobalState } from "react-hooks-global-state"
import parseJwt from "./jwtUtils"

// This a global state object to store permissions data
// to be used for rendering components

const initialState = {
  permissions: [],
}

const { useGlobalState, setGlobalState } = createGlobalState(initialState)

const updatePermissionsFromToken = (token) => {
  const decodedToken = parseJwt(token)
  setGlobalState("permissions", decodedToken.permissions)
  console.log(decodedToken.permissions)
}

export { useGlobalState, updatePermissionsFromToken }
