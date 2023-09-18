import { User } from "firebase/auth";
import { createContext } from "react";

export type UserContextType = {
  user: User | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  loading: false,
  setLoading: () => {},
});

export default UserContext;
