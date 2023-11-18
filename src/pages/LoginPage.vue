<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          style="opacity: 0.9"
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '50%' }"
        >
          <q-card-section>
            <img
              src="~assets/login.svg"
              width="200"
              height="180"
              class="absolute-center shadow-10"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Iniciar</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              ref="formLogin"
              autocomplete="off"
              class="q-gutter-md"
              @submit.prevent="login"
            >
              <q-input
                filled
                v-model="user"
                label="Usuario"
                class="text-lowercase"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Requerido']"
              />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Contraseña"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Requerido']"
              />

              <div class="row text-center">
                <div class="col-12">
                  <q-btn label="Acceder" type="submit" color="secondary" />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "LoginPage",
};
</script>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import { getConfig, editConfig } from "src/services/configServices";
import { useAuthStore } from "src/stores/auth";

const user = ref("");
const password = ref("");
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isLoggedIn()) {
    await router.push({ path: "/" });
  }
});

const login = async () => {
  try {
    $q.loading.show();
    const response = await getConfig();
    if (user.value == response.user && password.value == response.password) {
      authStore.login(user.value);
      await router.push({ path: "/" });
    } else {
      $q.notify({
        type: "warning",
        position: "center",
        message: "Usuario o contraseña incorrecta.",
        actions: [{ icon: "las la-times-circle", color: "white" }],
      });
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      position: "top-right",
      message: "Error Interno, Intente mas Tarde",
      actions: [{ icon: "las la-times-circle", color: "white" }],
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style>
.bg-image {
  background: url("../assets/breakfast.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: black;
}
</style>
