import { useSelector } from "react-redux"

export const SessionAuth = () => {
    const { isSessionActive } = useSelector((state) => state.session);
  return {
      isSessionActive
  }
}

export default SessionAuth;
