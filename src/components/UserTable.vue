<template>
  <q-card flat bordered>
    <q-table
      title="Directorio Corporativo"
      :rows="usuarios"
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
    </q-table>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from 'src/services/userService'

const emit = defineEmits(['view-user'])

const loading = ref(false)

const usuarios = ref([])

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
