<template>
  <q-page class="q-pa-md">
    <div>
      <q-card class="no-border no-shadow bg-transparent">
        <q-card-section class="q-pa-sm">
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
    </div>

    <div class="row q-col-gutter-md">
      <div
        class="col-md-4 col-lg-4 col-sm-12 col-xs-12"
        v-for="(item, item_index) in filterProducts"
        :key="item_index"
      >
        <CardProduct
          :products="item"
          @detailProduct="detailProduct"
        ></CardProduct>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="las la-plus"
        color="secondary"
        @click="modalAdd = true"
      />
    </q-page-sticky>

    <!-- modal add and edit -->
    <q-dialog v-model="modalAdd">
      <q-card style="width: 700px; max-width: 80vw">
        <q-toolbar>
          <q-avatar>
            <q-icon name="las la-utensils" />
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">{{ formTitle }}</span>
            Plato</q-toolbar-title
          >

          <q-btn flat round dense icon="las la-times" @click="closeModal" />
        </q-toolbar>

        <q-separator />

        <q-form @submit="onSubmit" class="q-gutter-sm">
          <q-card-section>
            <div class="col-12">
              <q-input
                v-model="name"
                label="Plato *"
                lazy-rules
                no-error-icon
                :rules="[(val) => (val && val.length > 0) || 'Requerido']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="description"
                autogrow
                label="Descripción *"
                lazy-rules
                no-error-icon
                :rules="[(val) => (val && val.length > 0) || 'Requerido']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="price"
                prefix="$"
                label="Precio *"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
                lazy-rules
                no-error-icon
                :rules="[(val) => (val && val.length > 0) || 'Requerido']"
              />
            </div>

            <div class="row">
              <div class="col-6 q-pt-sm">
                <q-file
                  v-model="file"
                  label="Foto"
                  @update:model-value="updateFile()"
                >
                  <template v-slot:prepend>
                    <q-icon name="las la-cloud-upload-alt" />
                  </template>
                </q-file>
              </div>
              <div class="col-6 q-pt-sm">
                <q-toggle
                  :label="available ? 'Disponible' : 'No disponible'"
                  color="secondary"
                  v-model="available"
                />
              </div>
            </div>

            <div class="col-12 q-pt-lg">
              <q-img
                v-if="localImage"
                :src="localImage"
                spinner-color="white"
                style="height: 140px; max-width: 150px"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              icon="las la-times"
              color="accent"
              @click="closeModal"
            />
            <q-btn flat icon="las la-save" color="positive" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- end modal add-->
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import CardProduct from "components/CardProduct.vue";
import {
  getProducts,
  addProduct,
  editProduct,
} from "src/services/productsServices";

import uploadImage from "src/helpers/uploadImages";

const filterText = ref("");
const data = ref([]);
const modalAdd = ref(false);
const name = ref("");
const description = ref("");
const price = ref(null);
const file = ref(null);
const localImage = ref("");
const editedId = ref(-1);
const available = ref(true);

const $q = useQuasar();

const getAllProducts = async () => {
  try {
    $q.loading.show();
    data.value = [];
    const response = await getProducts();
    for (const id of Object.keys(response)) {
      data.value.push({ id, ...response[id] });
    }
    $q.loading.hide();
  } catch (error) {
    console.log(error);
    $q.loading.hide();
  }
};

onMounted(async () => {
  await getAllProducts();
});

const saveProduct = async () => {
  try {
    //new product
    if (editedId.value === -1) {
      $q.loading.show();
      const picture = await uploadImage(file.value);
      let product = {
        available: true,
        name: name.value,
        description: description.value,
        price: parseFloat(price.value),
        picture: picture,
      };
      const response = await addProduct(product);
      $q.notify({
        type: "positive",
        position: "top-right",
        icon: "las la-check-circle",

        message: "Producto Agregado Correctamente.",
        //actions: [{ icon: "las la-times-circle", color: "white" }],
      });
    } else {
      //edit product
      $q.loading.show();
      //const picture = await uploadImage(file.value);
      let picture = "";
      if (file.value === null || file.value === "") {
        picture = localImage.value;
      } else {
        picture = await uploadImage(file.value);
      }

      let product = {
        available: available.value,
        name: name.value,
        description: description.value,
        price: parseFloat(price.value),
        picture: picture,
      };
      const response = await editProduct(editedId.value, product);
      $q.notify({
        type: "positive",
        icon: "las la-check-circle",
        position: "top-right",
        message: "Producto Editado Correctamente.",
        //actions: [{ icon: "las la-check-circle", color: "white" }],
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
    closeModal();
    getAllProducts();
  }
};

const detailProduct = async (product) => {
  editedId.value = product.id;
  name.value = product.name;
  description.value = product.description;
  price.value = product.price.toFixed(2);
  available.value = product.available;
  localImage.value = product.picture;
  modalAdd.value = true;
};

const closeModal = () => {
  name.value = "";
  description.value = "";
  price.value = "";
  localImage.value = "";
  file.value = "";
  editedId.value = -1;
  modalAdd.value = false;
};

const filterProducts = computed(() => {
  let filter = filterText.value;
  if (!filter.length) return data.value;
  return data.value.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
});

const updateFile = () => {
  if (file.value) {
    localImage.value = URL.createObjectURL(file.value);
  }
};

const onSubmit = async () => {
  await saveProduct();
};

const formTitle = computed(() =>
  editedId.value === -1 ? "Nuevo " : "Editar "
);
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
}
</style>
