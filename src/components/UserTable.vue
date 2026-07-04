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
            clearable
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
          <q-input v-model="filtros.ciudad" dense outlined label="Ciudad" clearable />
        </div>
        <div class="col-6 col-md-2">
          <q-input v-model="filtros.pais" dense outlined label="País" clearable />
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
            @click="verDetalle(props.row)"
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
  </q-card>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { getUsers } from 'src/services/userService'

const emit = defineEmits(['view-user'])

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

const verDetalle = (usuario) => {
  console.log(usuario)

  emit('view-user', usuario)
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
