<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Dashboard de Indicadores</div>
        <div class="text-subtitle2 text-grey-7">Resumen de usuarios, género, edad, empresas y ciudades</div>
      </div>
    </div>

    <div class="q-gutter-md">
      <q-card class="q-pa-md bg-grey-1">
        <div class="row q-col-gutter-md">
          <q-card-section class="col-12 col-md-4">
            <div class="text-caption text-grey-7">Total de usuarios</div>
            <div class="text-h3 text-primary text-weight-bold">{{ stats.totalUsers }}</div>
          </q-card-section>

          <q-card-section class="col-12 col-md-4">
            <div class="text-caption text-grey-7">Hombres</div>
            <div class="text-h3 text-secondary text-weight-bold">{{ stats.maleCount }}</div>
          </q-card-section>

          <q-card-section class="col-12 col-md-4">
            <div class="text-caption text-grey-7">Mujeres</div>
            <div class="text-h3 text-pink text-weight-bold">{{ stats.femaleCount }}</div>
          </q-card-section>
        </div>
      </q-card>

      <div class="row q-gutter-md">
        <q-card class="col-12 col-md-6 q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Edad promedio</div>
          <div class="text-h3 text-weight-bold">{{ stats.averageAge }}</div>
          <div class="text-caption text-grey-7">Calculado en el frontend a partir de los usuarios cargados</div>
        </q-card>

        <q-card class="col-12 col-md-6 q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Ciudades distintas</div>
          <div class="text-h6 q-mb-md">{{ stats.cities.length }} ciudades</div>
          <q-chip-group class="row q-col-gutter-xs" inline>
            <q-chip v-for="city in stats.cities" :key="city" dense>{{ city }}</q-chip>
          </q-chip-group>
        </q-card>
      </div>

      <div class="row q-gutter-md">
        <q-card class="col-12 col-md-6 q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Empresas distintas</div>
          <div class="text-h6 q-mb-md">{{ stats.companies.length }} empresas</div>
          <q-chip-group class="row q-col-gutter-xs" inline>
            <q-chip v-for="company in stats.companies" :key="company" dense>{{ company }}</q-chip>
          </q-chip-group>
        </q-card>

        <q-card class="col-12 col-md-6 q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Usuarios por empresa</div>
          <div v-for="item in stats.usersByCompany" :key="item.company" class="row items-center q-py-xs">
            <div class="col">{{ item.company }}</div>
            <div class="text-weight-bold">{{ item.count }}</div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from 'src/services/userService'

const usuarios = ref([])
const stats = ref({
  totalUsers: 0,
  maleCount: 0,
  femaleCount: 0,
  averageAge: 0,
  companies: [],
  cities: [],
  usersByCompany: [],
})

const calcularEstadisticas = (data) => {
  const total = data.length
  const male = data.filter((user) => user.gender === 'male').length
  const female = data.filter((user) => user.gender === 'female').length
  const ageSum = data.reduce((sum, user) => sum + Number(user.age || 0), 0)
  const averageAge = total ? Math.round(ageSum / total) : 0

  const companies = [...new Set(data.map((user) => user.company?.name).filter(Boolean))]
  const cities = [...new Set(data.map((user) => user.address?.city).filter(Boolean))]

  const usersByCompany = companies
    .map((company) => ({
      company,
      count: data.filter((user) => user.company?.name === company).length,
    }))
    .sort((a, b) => b.count - a.count)

  stats.value = {
    totalUsers: total,
    maleCount: male,
    femaleCount: female,
    averageAge,
    companies,
    cities,
    usersByCompany,
  }
}

const cargarUsuarios = async () => {
  try {
    const { users } = await getUsers(100, 0)
    usuarios.value = users
    calcularEstadisticas(users)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
q-chip-group {
  flex-wrap: wrap;
}
</style>
