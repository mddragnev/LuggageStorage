import User from "../schema/user";
import axios from "./axios";
export const login: any = async (email: string, password: string) => {
  return await axios.post(
    "/login",
    {
      email: email,
      password,
    },
    {
      withCredentials: true,
    }
  );
};

export const register: any = async (user: User) => {
  const result = await axios.post(
    "/register",
    {
      user,
    },
    {
      withCredentials: true,
    }
  );
  return result;
};

export const registerPartner: any = async (
  address: any,
  contact: any,
  hours: any
) => {
  const result = await axios.post(
    "/register/partner",
    {
      addressInfo: address,
      contactInfo: contact,
      workingTime: hours,
    },
    {
      withCredentials: true,
    }
  );
  return result;
};
