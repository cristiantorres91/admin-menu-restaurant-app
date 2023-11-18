import { LocalStorage } from "quasar";

import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userName: LocalStorage.getItem("userName") || "",
  }),

  actions: {
    login(userName) {
      LocalStorage.set("userName", userName);
    },
    logout() {
      LocalStorage.remove("userName");
    },
    isLoggedIn() {
      return !!LocalStorage.getItem("userName");
    },
  },
});
