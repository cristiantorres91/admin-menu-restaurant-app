import { api } from "boot/axios";

export const getConfig = async () => {
  var resp = await api.get(`config.json`);
  return resp.data;
};

export const editConfig = async (config) => {
  var resp = await api.patch(`config.json`, config);
  return resp.data;
};
