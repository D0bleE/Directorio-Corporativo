<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">
      Comparación de usuarios
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-select
          v-model="userOneId"
          :options="userOptions"
          label="Seleccionar usuario 1"
          emit-value
          map-options
          outlined
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="userTwoId"
          :options="userOptions"
          label="Seleccionar usuario 2"
          emit-value
          map-options
          outlined
        />
      </div>
    </div>

    <q-btn
      color="primary"
      label="Comparar usuarios"
      @click="compareUsers"
      :disable="!userOneId || !userTwoId || userOneId === userTwoId"
      class="q-mb-lg"
    />

    <q-banner
      v-if="userOneId === userTwoId && userOneId"
      class="bg-orange-2 text-orange-10 q-mb-md"
    >
      Debes seleccionar dos usuarios diferentes.
    </q-banner>

    <q-table
      v-if="comparisonRows.length > 0"
      title="Resultado de comparación"
      :rows="comparisonRows"
      :columns="columns"
      row-key="field"
      flat
      bordered
    >
      <template v-slot:body-cell-userOne="props">
        <q-td :props="props">
          <span :class="props.row.different ? 'text-negative text-bold' : ''">
            {{ props.row.userOne }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-userTwo="props">
        <q-td :props="props">
          <span :class="props.row.different ? 'text-negative text-bold' : ''">
            {{ props.row.userTwo }}
          </span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

const users = ref([])
const userOptions = ref([])
const userOneId = ref(null)
const userTwoId = ref(null)
const comparisonRows = ref([])

const columns = [
  {
    name: 'field',
    label: 'Campo',
    field: 'field',
    align: 'left'
  },
  {
    name: 'userOne',
    label: 'Usuario 1',
    field: 'userOne',
    align: 'left'
  },
  {
    name: 'userTwo',
    label: 'Usuario 2',
    field: 'userTwo',
    align: 'left'
  }
]

onMounted(async () => {
  await getUsers()
})

async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/users`)
    const data = await response.json()

    users.value = data.users

    userOptions.value = data.users.map(user => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id
    }))
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

function compareUsers() {
  const userOne = users.value.find(user => user.id === userOneId.value)
  const userTwo = users.value.find(user => user.id === userTwoId.value)

  if (!userOne || !userTwo) return

  comparisonRows.value = [
    createRow('ID', userOne.id, userTwo.id),
    createRow('Nombre', userOne.firstName, userTwo.firstName),
    createRow('Apellido', userOne.lastName, userTwo.lastName),
    createRow('Edad', userOne.age, userTwo.age),
    createRow('Género', userOne.gender, userTwo.gender),
    createRow('Email', userOne.email, userTwo.email),
    createRow('Teléfono', userOne.phone, userTwo.phone),
    createRow('Usuario', userOne.username, userTwo.username),
    createRow('Fecha de nacimiento', userOne.birthDate, userTwo.birthDate),
    createRow('Grupo sanguíneo', userOne.bloodGroup, userTwo.bloodGroup),
    createRow('Altura', userOne.height, userTwo.height),
    createRow('Peso', userOne.weight, userTwo.weight),
    createRow('Color de ojos', userOne.eyeColor, userTwo.eyeColor),
    createRow('Cabello', formatHair(userOne.hair), formatHair(userTwo.hair)),
    createRow('Dirección', formatAddress(userOne.address), formatAddress(userTwo.address)),
    createRow('Universidad', userOne.university, userTwo.university),
    createRow('Empresa', formatCompany(userOne.company), formatCompany(userTwo.company)),
    createRow('Banco', formatBank(userOne.bank), formatBank(userTwo.bank)),
    createRow('Criptomoneda', formatCrypto(userOne.crypto), formatCrypto(userTwo.crypto)),
    createRow('Rol', userOne.role, userTwo.role)
  ]
}

function createRow(field, valueOne, valueTwo) {
  return {
    field,
    userOne: valueOne || 'No disponible',
    userTwo: valueTwo || 'No disponible',
    different: valueOne !== valueTwo
  }
}

function formatAddress(address) {
  if (!address) return 'No disponible'

  return `${address.address}, ${address.city}, ${address.state}, ${address.country}`
}

function formatCompany(company) {
  if (!company) return 'No disponible'

  return `${company.name} - ${company.department} - ${company.title}`
}

function formatBank(bank) {
  if (!bank) return 'No disponible'

  return `${bank.cardType} - ${bank.cardNumber}`
}

function formatCrypto(crypto) {
  if (!crypto) return 'No disponible'

  return `${crypto.coin} - ${crypto.wallet}`
}

function formatHair(hair) {
  if (!hair) return 'No disponible'

  return `${hair.color} - ${hair.type}`
}
</script>