import axios from "../services/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth }: any = useAuth();
  const logout = async () => {
    setAuth({});
    try {
      const response = await axios("/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};
export default useLogout;
