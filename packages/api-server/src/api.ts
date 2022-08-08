export { app } from "./app";
import axios from "axios";

const switchUrl = "http://localhost:3000/trpc/switch";

export const refactorSwitch = async (body: any) => {
  //
  try {
    const response = await axios.post(switchUrl, body);
    return response;

    // return response.data;
  } catch (error: any) {
    console.log({ error });
    return error?.response?.data;
  }
};
