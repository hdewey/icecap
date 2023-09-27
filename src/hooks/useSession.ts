import { useSession as nextAuthUseSession } from "next-auth/react"
import { SessionWithToken } from "../pages/api/auth/[...nextauth]";

export const useSession = () => {
  const { data: session, status } = nextAuthUseSession();

  return { session: session as SessionWithToken, status };
};