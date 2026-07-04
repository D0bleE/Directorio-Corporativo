<template>
  <q-page class="q-pa-lg cart-page">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Carrito de compras</div>
        <div class="text-subtitle2 text-grey-7">Productos del usuario seleccionado</div>
      </div>

      <q-btn color="primary" icon="arrow_back" label="Volver al directorio" no-caps to="/" />
    </div>

    <q-card flat bordered class="bg-white">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h6 text-grey-9">Usuario seleccionado</div>
            <div class="text-subtitle1 text-grey-9">
              Nombre: <span class="text-h6 text-primary">{{ userName }}</span>
            </div>
            <div class="text-subtitle1 text-grey-9">
              Total de productos: <span class="text-h6 text-primary">{{ totalProducts }}</span>
            </div>
            <div class="text-subtitle1 text-grey-9">
              Cantidad total: <span class="text-h6 text-primary">{{ totalQuantity }}</span>
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <div class="text-subtitle1 text-grey-9">Total general</div>
            <div class="text-h6 text-primary">{{ formatoMoneda(cartTotal) }}</div>
            <div v-if="cartDiscountedTotal !== null" class="text-caption text-grey-7">
              Total con descuento: {{ formatoMoneda(cartDiscountedTotal) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="products"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          :rows-per-page-options="[5, 10, 20]"
          pagination="{ rowsPerPage: 5 }"
        >
          <template v-slot:body-cell-thumbnail="props">
            <q-td :props="props">
              <q-img
                :src="props.row.thumbnail"
                :alt="props.row.title"
                style="width: 60px; height: 60px"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-price="props">
            <q-td :props="props">{{ formatoMoneda(props.row.price) }}</q-td>
          </template>

          <template v-slot:body-cell-subtotal="props">
            <q-td :props="props">{{ formatoMoneda(props.row.total) }}</q-td>
          </template>
        </q-table>

        <div v-if="!loading && products.length === 0" class="q-pa-md text-center text-grey-7">
          No se encontraron productos en el carrito.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserCarts, getUserById } from 'src/services/userService'

const route = useRoute()
const userId = route.params.userId

const loading = ref(false)
const carts = ref([])
const userName = ref('')

const selectedCart = computed(() => carts.value[0] || null)
const products = computed(() => selectedCart.value?.products || [])
const cartTotal = computed(() => selectedCart.value?.total ?? 0)
const cartDiscountedTotal = computed(() => selectedCart.value?.discountedTotal ?? null)
const totalProducts = computed(() => selectedCart.value?.totalProducts ?? 0)
const totalQuantity = computed(() => selectedCart.value?.totalQuantity ?? 0)

const columns = [
  {
    name: 'thumbnail',
    label: 'Imagen',
    field: 'thumbnail',
    align: 'left',
  },
  {
    name: 'title',
    label: 'Producto',
    field: 'title',
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Cantidad',
    field: 'quantity',
    align: 'center',
  },
  {
    name: 'price',
    label: 'Precio unitario',
    field: 'price',
    align: 'center',
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    field: 'total',
    align: 'center',
  },
]

const cargarCarrito = async () => {
  loading.value = true

  try {
    const data = await getUserCarts(userId)
    carts.value = data?.carts || []

    const userData = await getUserById(userId)
    userName.value = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
  } catch (error) {
    console.error('Error al cargar carrito:', error)
    carts.value = []
    userName.value = ''
  } finally {
    loading.value = false
  }
}

const formatoMoneda = (value) => {
  if (value == null) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

onMounted(() => {
  cargarCarrito()
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
}

:deep(.q-table__title) {
  font-size: 20px;
  font-weight: 600;
}

:deep(.q-table th) {
  font-weight: 600;
}
</style>
