import { api } from "boot/axios";

export const getOrdersByDate = async (date) => {
  var resp = await api.get(
    `orders.json?orderBy="date"&startAt="${date} 00:00:00"&endAt="${date} 11:59:59"`
  );
  return resp.data;
};

export const editOrder = async (id, order) => {
  var resp = await api.patch(`orders/${id}.json`, order);
  return resp.data;
};
