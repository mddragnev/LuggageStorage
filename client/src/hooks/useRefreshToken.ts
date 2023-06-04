import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();
  const refresh = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_URL + "/refresh",
      { withCredentials: true }
    );
    setAuth((prev: any) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        role: response.data.role,
        id: response.data.id,
        email: response.data.email,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
