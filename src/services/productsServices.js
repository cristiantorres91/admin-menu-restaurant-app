import { api } from "boot/axios";

export const getProducts = async () => {
  var resp = await api.get(`menu.json`);
  return resp.data;
};

export const addProduct = async (product) => {
  var resp = await api.post(`menu.json`, product);
  return resp.data;
};

export const editProduct = async (id, product) => {
  var resp = await api.put(`menu/${id}.json`, product);
  return resp.data;
};
