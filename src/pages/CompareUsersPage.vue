<template>
  <q-page class="q-pa-lg compare-page">
    <!-- ENCABEZADO -->
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-white">
          Comparación de usuarios
        </div>

        <div class="text-subtitle2 text-grey-4">
          Selecciona dos colaboradores para comparar su información
        </div>
      </div>

      <q-btn
        color="primary"
        icon="arrow_back"
        label="Volver al directorio"
        no-caps
        to="/"
      />
    </div>

    <!-- SELECTORES -->
    <q-card flat bordered class="q-pa-md q-mb-lg bg-white">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="usuario1Id"
            :options="opcionesUsuarios"
            label="Seleccionar usuario 1"
            outlined
            emit-value
            map-options
            :loading="loading"
            popup-content-class="bg-white text-black"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label class="text-black">
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="usuario2Id"
            :options="opcionesUsuarios"
            label="Seleccionar usuario 2"
            outlined
            emit-value
            map-options
            :loading="loading"
            popup-content-class="bg-white text-black"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label class="text-black">
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>

      <div class="q-mt-md">
        <q-btn
          color="primary"
          icon="compare_arrows"
          label="Comparar usuarios"
          no-caps
          :disable="!puedeComparar"
          @click="compararUsuarios"
        />
      </div>

      <q-banner
        v-if="usuario1Id && usuario2Id && usuario1Id === usuario2Id"
        class="bg-orange-2 text-orange-10 q-mt-md"
      >
        Debes seleccionar dos usuarios diferentes.
      </q-banner>
    </q-card>

    <!-- RESULTADO -->
    <q-card
      v-if="filasComparacion.length > 0"
      flat
      bordered
      class="bg-white"
    >
      <q-table
        title="Resultado de comparación"
        :rows="filasComparacion"
        :columns="columns"
        row-key="campo"
        flat
        bordered
        v-model:pagination="paginationTabla"
        :rows-per-page-options="[10, 20, 0]"
      >
        <template v-slot:body-cell-usuario1="props">
          <q-td :props="props">
            <span :class="props.row.esDiferente ? 'text-negative text-weight-bold' : 'text-black'">
              {{ props.row.usuario1 }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-usuario2="props">
          <q-td :props="props">
            <span :class="props.row.esDiferente ? 'text-negative text-weight-bold' : 'text-black'">
              {{ props.row.usuario2 }}
            </span>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

const loading = ref(false)

const usuarios = ref([])
const opcionesUsuarios = ref([])

const usuario1Id = ref(null)
const usuario2Id = ref(null)

const filasComparacion = ref([])

const paginationTabla = ref({
  rowsPerPage: 20,
})

const columns = [
  {
    name: 'campo',
    label: 'Campo',
    field: 'campo',
    align: 'left',
  },
  {
    name: 'usuario1',
    label: 'Usuario 1',
    field: 'usuario1',
    align: 'left',
  },
  {
    name: 'usuario2',
    label: 'Usuario 2',
    field: 'usuario2',
    align: 'left',
  },
]

const puedeComparar = computed(() => {
  return usuario1Id.value && usuario2Id.value && usuario1Id.value !== usuario2Id.value
})

onMounted(() => {
  cargarUsuarios()
})

const cargarUsuarios = async () => {
  loading.value = true

  try {
    const response = await fetch(`${API_URL}/users?limit=100&skip=0`)
    const data = await response.json()

    usuarios.value = data?.users || []

    opcionesUsuarios.value = usuarios.value.map((usuario) => ({
      label: `${usuario.firstName} ${usuario.lastName}`,
      value: usuario.id,
    }))
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    usuarios.value = []
    opcionesUsuarios.value = []
  } finally {
    loading.value = false
  }
}

const compararUsuarios = () => {
  const usuario1 = usuarios.value.find((usuario) => usuario.id === usuario1Id.value)
  const usuario2 = usuarios.value.find((usuario) => usuario.id === usuario2Id.value)

  if (!usuario1 || !usuario2) {
    filasComparacion.value = []
    return
  }

  filasComparacion.value = [
    crearFila('ID', usuario1.id, usuario2.id),
    crearFila('Imagen', usuario1.image, usuario2.image),
    crearFila('Nombre', usuario1.firstName, usuario2.firstName),
    crearFila('Apellido', usuario1.lastName, usuario2.lastName),
    crearFila('Edad', usuario1.age, usuario2.age),
    crearFila('Género', usuario1.gender, usuario2.gender),
    crearFila('Correo', usuario1.email, usuario2.email),
    crearFila('Teléfono', usuario1.phone, usuario2.phone),
    crearFila('Usuario', usuario1.username, usuario2.username),
    crearFila('Fecha de nacimiento', usuario1.birthDate, usuario2.birthDate),
    crearFila('Grupo sanguíneo', usuario1.bloodGroup, usuario2.bloodGroup),
    crearFila('Altura', usuario1.height, usuario2.height),
    crearFila('Peso', usuario1.weight, usuario2.weight),
    crearFila('Color de ojos', usuario1.eyeColor, usuario2.eyeColor),
    crearFila('Cabello', formatearCabello(usuario1.hair), formatearCabello(usuario2.hair)),
    crearFila('Dirección', formatearDireccion(usuario1.address), formatearDireccion(usuario2.address)),
    crearFila('Universidad', usuario1.university, usuario2.university),
    crearFila('Empresa', formatearEmpresa(usuario1.company), formatearEmpresa(usuario2.company)),
    crearFila('Banco', formatearBanco(usuario1.bank), formatearBanco(usuario2.bank)),
    crearFila('Criptomoneda', formatearCrypto(usuario1.crypto), formatearCrypto(usuario2.crypto)),
    crearFila('Rol', usuario1.role, usuario2.role),
  ]
}

const crearFila = (campo, valor1, valor2) => {
  const dato1 = valor1 || 'No disponible'
  const dato2 = valor2 || 'No disponible'

  return {
    campo,
    usuario1: dato1,
    usuario2: dato2,
    esDiferente: String(dato1) !== String(dato2),
  }
}

const formatearDireccion = (address) => {
  if (!address) return 'No disponible'

  return `${address.address || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}`
}

const formatearEmpresa = (company) => {
  if (!company) return 'No disponible'

  return `${company.name || ''} - ${company.department || ''} - ${company.title || ''}`
}

const formatearBanco = (bank) => {
  if (!bank) return 'No disponible'

  return `${bank.cardType || ''} - ${bank.cardNumber || ''}`
}

const formatearCrypto = (crypto) => {
  if (!crypto) return 'No disponible'

  return `${crypto.coin || ''} - ${crypto.wallet || ''}`
}

const formatearCabello = (hair) => {
  if (!hair) return 'No disponible'

  return `${hair.color || ''} - ${hair.type || ''}`
}
</script>

<style scoped>
.compare-page {
  min-height: 100vh;
}

:deep(.q-table__title) {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
}

:deep(.q-table th) {
  color: #000000;
  font-weight: 600;
}

:deep(.q-table td) {
  color: #000000;
}

:deep(.q-field__control) {
  background: #ffffff;
}

:deep(.q-field__label) {
  color: #666666 !important;
}

:deep(.q-field__native) {
  color: #000000 !important;
}

:deep(.q-item__label) {
  color: #000000 !important;
}
</style>