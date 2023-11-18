<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card
          style="opacity: 0.9"
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '50%' }"
        >
          <q-card-section>
            <img
              src="~assets/settings.svg"
              width="200"
              height="180"
              class="absolute-center shadow-10"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Configuraciónes</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              ref="formLogin"
              autocomplete="off"
              class="q-gutter-md"
              @submit.prevent="save"
            >
              <div>
                <q-checkbox
                  left-label
                  v-model="data.isWorkDay"
                  label="Recibir pedidos"
                />
              </div>

              <div class="row text-center">
                <div class="col-12">
                  <q-btn label="Guardar" type="submit" color="secondary" />
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
  name: "ConfigPage",
};
</script>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import { getConfig, editConfig } from "src/services/configServices";

const data = ref([]);
const router = useRouter();
const $q = useQuasar();

onMounted(async () => {
  await getConfigs();
});

const getConfigs = async () => {
  try {
    $q.loading.show();
    data.value = await getConfig();
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

const save = async () => {
  try {
    let config = {
      isWorkDay: data.value.isWorkDay,
    };

    await editConfig(config);
    $q.notify({
      type: "positive",
      position: "top-right",
      icon: "las la-check-circle",

      message: "Configuración guardada.",
      actions: [{ icon: "las la-times-circle", color: "white" }],
    });
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
    getConfigs();
  }
};
</script>

<style></style>
