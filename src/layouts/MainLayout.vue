<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Menú Restaurante</q-toolbar-title>

        <div>
          <q-btn flat round icon="las la-sign-out-alt" @click="logout()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list padding>
          <q-item-label header> Menú Restaurante</q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
      <!-- <q-img
        class="absolute-top"
        src="https://www.periodicoequilibrium.com/wp-content/uploads/2019/10/0406.jpg"
        style="height: 150px"
      >
      </q-img> -->

      <q-img
        alt="logo menu app"
        class="absolute-top q-mt-md"
        src="~assets/breakfast.svg"
        style="height: 140px"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>

<script setup>
import EssentialLink from "components/EssentialLink.vue";
import { linksList } from "../router/link-list";

import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const authStore = useAuthStore();
const router = useRouter();

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push({ path: "/login" });
};
</script>

<style lang="scss">
// .q-drawer__content {
//   //background: #fad8d6 !important;
// }
</style>
