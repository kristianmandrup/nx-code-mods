import * as app from "./app";
import axios from "axios";

export const refactorSwitch = async (body: any) => {
  const response = await axios.post("https://localhost:3000/trpc/switch", body);
  return response.data;
};
