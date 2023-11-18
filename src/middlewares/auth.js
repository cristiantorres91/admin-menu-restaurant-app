import { useAuthStore } from "src/stores/auth";

async function auth(to, from, next) {
  const authStore = useAuthStore();
  const isLoggedIn = await authStore.isLoggedIn();
  if (to.meta.requireAuth) {
    if (isLoggedIn) {
      next();
      return;
    }
    next("/Login");
  } else {
    next();
  }
}

export default {
  auth,
};
