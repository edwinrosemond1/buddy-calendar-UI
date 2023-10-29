import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import { createContext } from "react";

export interface CalendarUser extends User {
  color: string;
}
export type UserContextType = {
  user: CalendarUser | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  claims: ParsedToken | undefined;
  token: string;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  loading: false,
  setLoading: () => {},
  claims: undefined,
  token: "",
});

export default UserContext;
