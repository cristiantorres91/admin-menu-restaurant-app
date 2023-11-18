import { api } from "boot/axios";

export const getOrders = async () => {
  var resp = await api.get(`orders.json`);
  return resp.data;
};

export const editOrder = async (id, order) => {
  var resp = await api.patch(`orders/${id}.json`, order);
  return resp.data;
};
