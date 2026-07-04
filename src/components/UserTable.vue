<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="filtros.busqueda"
            dense
            outlined
            placeholder="Buscar por nombre o apellido"
            clearableactua
          >
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-6 col-md-2">
          <q-select
            v-model="filtros.genero"
            :options="['male', 'female']"
            dense
            outlined
            label="Género"
            clearable
          />
        </div>
        <div class="col-3 col-md-1">
          <q-input
            v-model.number="filtros.edadMin"
            type="number"
            dense
            outlined
            label="Edad Min"
            clearable
          />
        </div>
        <div class="col-3 col-md-1">
          <q-input
            v-model.number="filtros.edadMax"
            type="number"
            dense
            outlined
            label="Edad Max"
            clearable
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input v-model="filtros.empresa" dense outlined label="Empresa" clearable />
        </div>
        <div class="col-6 col-md-1">
          <q-input
            v-model="filtros.ciudad"
            dense
            outlined
            label="Ciudad"
            clearable
            @input="filtros.ciudad = filtros.ciudad.replace(/\d+/g, '')"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-input
            v-model="filtros.pais"
            dense
            outlined
            label="País"
            clearable
            @input="filtros.pais = filtros.pais.replace(/\d+/g, '')"
          />
        </div>
      </div>
    </q-card-section>

    <q-table
      title="Directorio Corporativo"
      :rows="usuariosFiltrados"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      binary-state-sort
      flat
      bordered
    >
      <!-- FOTO -->
      <template v-slot:body-cell-foto="props">
        <q-td :props="props">
          <q-avatar size="50px">
            <img :src="props.row.image" :alt="props.row.firstName" />
          </q-avatar>
        </q-td>
      </template>

      <!-- NOMBRE -->
      <template v-slot:body-cell-nombre="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.firstName }} {{ props.row.lastName }}</div>
        </q-td>
      </template>

      <!-- GÉNERO -->
      <template v-slot:body-cell-gender="props">
        <q-td :props="props">
          <q-badge :color="props.row.gender === 'male' ? 'primary' : 'pink'">
            {{ props.row.gender }}
          </q-badge>
        </q-td>
      </template>

      <!-- EMPRESA -->
      <template v-slot:body-cell-company="props">
        <q-td :props="props">
          {{ props.row.company.name }}
        </q-td>
      </template>

      <!-- CARGO -->
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          {{ props.row.company.title }}
        </q-td>
      </template>

      <!-- CIUDAD -->
      <template v-slot:body-cell-city="props">
        <q-td :props="props">
          {{ props.row.address.city }}
        </q-td>
      </template>

      <!-- PAIS -->
      <template v-slot:body-cell-country="props">
        <q-td :props="props">
          {{ props.row.address.country }}
        </q-td>
      </template>

      <!-- BOTÓN -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            icon="visibility"
            label="Ver detalle"
            no-caps
            @click="openDialog(props.row)"
          />
        </q-td>
      </template>

      <!-- LOADING -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-negative q-pa-md">
          <q-icon size="2em" name="warning" class="q-mr-sm" />
          <span>No se encontraron colaboradores que coincidan con la búsqueda.</span>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="dialog" persistent>
      <q-card class="bg-white text-black" style="min-width: 680px; max-width: 95vw">
        <q-card-section class="text-black">
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-avatar size="96px">
                <img :src="detailUser.image" :alt="detailUser.firstName" />
              </q-avatar>
            </div>
            <div class="col">
              <div class="text-h6">{{ detailUser.firstName }} {{ detailUser.lastName }}</div>
              <div class="text-subtitle2 text-black">
                ID: {{ detailUser.id }} · {{ detailUser.email }}
              </div>
            </div>
          </div>

          <q-tabs
            v-model="selectedTab"
            align="left"
            active-color="primary"
            indicator-color="primary"
            class="text-black q-mt-md"
            @update:model-value="onTabChange"
          >
            <q-tab name="detalle" label="Detalle" />
            <q-tab name="compras" label="Compras" />
          </q-tabs>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md q-row-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Datos personales</div>
              <div>Edad: {{ detailUser.age }}</div>
              <div>Género: {{ detailUser.gender }}</div>
              <div>Teléfono: {{ detailUser.phone }}</div>
              <div>Usuario: {{ detailUser.username }}</div>
              <div>Fecha de nacimiento: {{ detailUser.birthDate }}</div>
              <div>Grupo sanguíneo: {{ detailUser.bloodGroup }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Información física</div>
              <div>Altura: {{ detailUser.height }} cm</div>
              <div>Peso: {{ detailUser.weight }} kg</div>
              <div>Color de ojos: {{ detailUser.eyeColor }}</div>
              <div>Cabello: {{ detailUser.hair?.color }} / {{ detailUser.hair?.type }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md q-row-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Información laboral</div>
              <div>Empresa: {{ detailUser.company?.name }}</div>
              <div>Cargo: {{ detailUser.company?.title }}</div>
              <div>Dominio: {{ detailUser.domain }}</div>
              <div>Departamento: {{ detailUser.company?.department }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Universidad</div>
              <div>{{ detailUser.university }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md q-row-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Dirección</div>
              <div>Dirección: {{ detailUser.address?.address }}</div>
              <div>Ciudad: {{ detailUser.address?.city }}</div>
              <div>Estado: {{ detailUser.address?.state }}</div>
              <div>Código postal: {{ detailUser.address?.postalCode }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle1">Banco</div>
              <div>IBAN: {{ detailUser.bank?.iban }}</div>
              <div>Tarjeta: {{ detailUser.bank?.cardNumber }}</div>
              <div>Tipo: {{ detailUser.bank?.cardType }}</div>
              <div>Divisa: {{ detailUser.bank?.currency }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-black">
          <div class="row q-col-gutter-md q-row-gutter-md">
            <div class="col-12">
              <div class="text-subtitle1">Criptomonedas</div>
              <div v-if="detailUser.crypto?.coin">Moneda: {{ detailUser.crypto.coin }}</div>
              <div v-if="detailUser.crypto?.wallet">Wallet: {{ detailUser.crypto.wallet }}</div>
              <div v-if="detailUser.crypto?.network">Red: {{ detailUser.crypto.network }}</div>
              <div
                v-if="
                  !detailUser.crypto?.coin &&
                  !detailUser.crypto?.wallet &&
                  !detailUser.crypto?.network
                "
              >
                No hay información de criptomonedas.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="dialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, getUserById } from 'src/services/userService'

const loading = ref(false)

const usuarios = ref([])

const filtros = reactive({
  busqueda: '',
  genero: null,
  edadMin: null,
  edadMax: null,
  empresa: '',
  ciudad: '',
  pais: '',
})

const dialog = ref(false)
const selectedTab = ref('detalle')
const router = useRouter()
const detailUser = reactive({})

const onTabChange = (tab) => {
  if (tab === 'compras') {
    selectedTab.value = 'detalle'
    goToCart()
  }
}

const goToCart = () => {
  dialog.value = false
  if (detailUser.id) {
    router.push({ name: 'cart-detail', params: { userId: detailUser.id } })
  }
}

const openDialog = async (usuario) => {
  try {
    loading.value = true
    const data = await getUserById(usuario.id)
    Object.keys(detailUser).forEach((key) => delete detailUser[key])
    Object.assign(detailUser, data)
    dialog.value = true
  } catch (error) {
    console.error('Error cargando detalle:', error)
  } finally {
    loading.value = false
  }
}

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter((user) => {
    const nombreCompleto = `${user.firstName} ${user.lastName}`.toLowerCase()
    const matchBusqueda =
      !filtros.busqueda || nombreCompleto.includes(filtros.busqueda.toLowerCase())
    const matchGenero = !filtros.genero || user.gender === filtros.genero
    const matchEdadMin = !filtros.edadMin || user.age >= filtros.edadMin
    const matchEdadMax = !filtros.edadMax || user.age <= filtros.edadMax
    const matchEmpresa =
      !filtros.empresa || user.company?.name.toLowerCase().includes(filtros.empresa.toLowerCase())
    const matchCiudad =
      !filtros.ciudad || user.address?.city.toLowerCase().includes(filtros.ciudad.toLowerCase())
    const matchPais =
      !filtros.pais || user.address?.country.toLowerCase().includes(filtros.pais.toLowerCase())

    return (
      matchBusqueda &&
      matchGenero &&
      matchEdadMin &&
      matchEdadMax &&
      matchEmpresa &&
      matchCiudad &&
      matchPais
    )
  })
})

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'foto',
    label: 'Foto',
    field: 'image',
    align: 'center',
  },

  {
    name: 'nombre',
    label: 'Nombre Completo',
    field: (row) => `${row.firstName} ${row.lastName}`,
    align: 'left',
  },

  {
    name: 'age',
    label: 'Edad',
    field: 'age',
    align: 'center',
    sortable: true,
  },

  {
    name: 'gender',
    label: 'Género',
    field: 'gender',
    align: 'center',
  },

  {
    name: 'email',
    label: 'Correo',
    field: 'email',
    align: 'left',
  },

  {
    name: 'company',
    label: 'Empresa',
    field: (row) => row.company.name,
    align: 'left',
  },

  {
    name: 'title',
    label: 'Cargo',
    field: (row) => row.company.title,
    align: 'left',
  },

  {
    name: 'city',
    label: 'Ciudad',
    field: (row) => row.address.city,
    align: 'left',
  },

  {
    name: 'country',
    label: 'País',
    field: (row) => row.address.country,
    align: 'left',
  },

  {
    name: 'action',
    label: 'Acción',
    align: 'center',
  },
]

const cargarUsuarios = async (page = 1) => {
  loading.value = true

  try {
    const limit = pagination.value.rowsPerPage

    const skip = (page - 1) * limit

    const data = await getUsers(limit, skip)

    usuarios.value = data.users

    pagination.value.rowsNumber = data.total

    pagination.value.page = page
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination

  cargarUsuarios(props.pagination.page)
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
.q-table {
  border-radius: 12px;
}
</style>
