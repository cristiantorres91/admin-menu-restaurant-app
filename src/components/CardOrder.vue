<template>
  <q-card class="my-card">
    <q-card-section class="">
      <div class="text-h6">{{ orders.phone }} - {{ orders.name }}</div>
      <!-- <div class="text-subtitle2">{{ orders.id }}</div> -->
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list dense bordered padding class="rounded-borders">
        <!-- Recorre orden y salto linea cada , -->
        <q-item
          clickable
          v-ripple
          v-for="(dish, index) in (orders.order || '').split(',')"
          :key="index"
        >
          <q-item-section>{{ dish }}</q-item-section>
        </q-item>
      </q-list>

      <div class="text-subtitle1 text-center q-mt-md">
        Total: <b>${{ orders.total }}</b>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="around">
      <div
        :class="[
          'text-h6',
          orders.status === 'p' ? 'text-primary' : 'text-warning',
        ]"
      >
        {{ orders.status == "p" ? "Pendiente" : "Listo" }}
      </div>
      <q-btn
        color="info"
        flat
        round
        icon="las la-edit"
        @click="showActions(orders)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  orders: {
    type: [],
    required: true,
  },
});

const emit = defineEmits(["showActions"]);

const showActions = (orders) => {
  emit("showActions", orders);
};
</script>

<style lang="scss" scoped>
.pre-line {
  white-space: pre-line;
}
.my-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
}
</style>
