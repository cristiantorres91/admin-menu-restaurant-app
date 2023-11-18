<template>
  <q-page class="q-pa-md">
    <q-card class="no-border no-shadow bg-transparent">
      <q-card-section class="q-pa-md">
        <q-input rounded v-model="filterText" outlined placeholder="Buscar">
          <template v-slot:append>
            <q-icon v-if="filterText === ''" name="las la-search" />
            <q-icon
              v-else
              name="las la-trash"
              class="cursor-pointer"
              @click="filterText = ''"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
    <q-option-group
      v-model="panel"
      inline
      :options="[
        { label: 'Pendiente', value: 'pending' },
        { label: 'Listo', value: 'ready' },
      ]"
    />

    <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
      <q-tab-panel name="pending">
        <div class="row q-col-gutter-md">
          <div
            v-if="filteredPendingOrders.length === 0"
            class="text-h6 text-info"
          >
            No hay órdenes
          </div>
          <div
            class="col-md-4 col-lg-4 col-sm-12 col-xs-12"
            v-for="(item, item_index) in filterOrdersPending"
            :key="item_index"
          >
            <CardOrder :orders="item" @showActions="showActions" />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="ready">
        <div class="row q-col-gutter-md">
          <div
            v-if="filteredReadyOrders.length === 0"
            class="text-h6 text-info"
          >
            No hay órdenes
          </div>
          <div
            class="col-md-4 col-lg-4 col-sm-12 col-xs-12"
            v-for="(item, item_index) in filterOrdersReady"
            :key="item_index"
          >
            <CardOrder :orders="item" @showActions="showActions" />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="las la-sync-alt"
        color="secondary"
        @click="getAllOrders()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar, date } from "quasar";
import CardOrder from "src/components/CardOrder.vue";
import { getOrders, editOrder } from "src/services/ordersServices";

const data = ref([]);
const $q = useQuasar();
const panel = ref("pending");
const filteredPendingOrders = ref([]);
const filteredReadyOrders = ref([]);
const filterText = ref("");

onMounted(async () => {
  await getAllOrders();
  updateFilteredOrders();
});

const filterOrdersPending = computed(() => {
  let filter = filterText.value;
  if (!filter.length) return filteredPendingOrders.value;
  return filteredPendingOrders.value.filter((o) =>
    o.name.toLowerCase().includes(filter.toLowerCase())
  );
});

const filterOrdersReady = computed(() => {
  let filter = filterText.value;
  if (!filter.length) return filteredReadyOrders.value;
  return filteredReadyOrders.value.filter((o) =>
    o.name.toLowerCase().includes(filter.toLowerCase())
  );
});

const updateFilteredOrders = () => {
  filteredPendingOrders.value = data.value.filter(
    (item) => item.status === "p"
  );
  filteredReadyOrders.value = data.value.filter((item) => item.status === "r");
};

watch(panel, updateFilteredOrders);

const getAllOrders = async () => {
  try {
    $q.loading.show();
    data.value = [];
    const response = await getOrders();
    for (const id of Object.keys(response)) {
      data.value.push({ id, ...response[id] });
    }
    $q.loading.hide();
  } catch (error) {
    console.log(error);
    $q.loading.hide();
  } finally {
    updateFilteredOrders();
  }
};

const showActions = (orders) => {
  $q.bottomSheet({
    dark: true,
    message: "Acciones",
    actions: [
      {
        label: "Listo",
        icon: "las la-check",
        color: "primary",
        id: "done",
      },

      {},
      {
        label: "Contactar",
        icon: "las la-id-card",
        color: "accent",
        id: "contact",
      },
    ],
  })
    .onOk(async (action) => {
      switch (action.id) {
        case "done":
          //update order status

          try {
            let order = {
              status: "r",
              statusDescription: "ready",
            };
            await editOrder(orders.id, order);

            await getAllOrders();
          } catch (error) {
            console.log(error);
            $q.notify({
              type: "negative",
              position: "center",
              message: "Error Interno, Intente mas Tarde",
              actions: [{ icon: "las la-times-circle", color: "white" }],
            });
          }

          break;

        case "contact":
          $q.dialog({
            title: `Contactos de <strong>${orders.name}</strong>`,
            message: `<ul> <li><strong> ${orders.phone}</strong> </li> <li><strong> ${orders.email}</strong> </li></ul>`,
            html: true,
          })
            .onOk(() => {
              // console.log('OK')
            })
            .onCancel(() => {
              // console.log('Cancel')
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
          break;
        default:
          break;
      }
    })
    .onCancel(() => {
      // console.log('Dismissed')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
</script>
