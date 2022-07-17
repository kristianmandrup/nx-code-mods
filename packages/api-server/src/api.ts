import { server } from "./app";
import axios from "axios";

server();

export const refactorSwitch = async (body: any) => {
  const response = await axios.post("https://localhost:3000/trpc/switch", body);
  return response.data;
};
