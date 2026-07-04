<template>
  <q-page class="q-pa-lg dashboard-page">
    <div class="row items-center justify-between q-mb-lg gap-sm">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">DashBoard</div>
      </div>

      <div class="row items-center gap-sm">
        <q-btn
          label="Actualizar"
          color="secondary"
          icon="refresh"
          rounded
          unelevated
          @click="cargarUsuarios"
        />
        <q-btn label="Volver al directorio" color="primary" to="/" rounded unelevated />
      </div>
    </div>

    <div class="row q-col-gutter-lg q-row-gutter-lg">
      <q-card class="metric-card col-12 col-md-6 col-xl-3 shadow-2">
        <q-card-section>
          <div class="metric-icon bg-primary text-white">
            <q-icon name="group" size="28px" />
          </div>
          <div class="text-caption text-grey-7 q-mb-xs">Total de usuarios</div>
          <div class="text-h3 text-weight-bold text-grey-9">{{ stats.totalUsers }}</div>
        </q-card-section>
      </q-card>

      <q-card class="metric-card col-12 col-md-6 col-xl-3 shadow-2">
        <q-card-section>
          <div class="metric-icon bg-blue-grey text-white">
            <q-icon name="male" size="28px" />
          </div>
          <div class="text-caption text-grey-7 q-mb-xs">Hombres</div>
          <div class="text-h3 text-weight-bold text-grey-9">{{ stats.maleCount }}</div>        </q-card-section>
      </q-card>

      <q-card class="metric-card col-12 col-md-6 col-xl-3 shadow-2">
        <q-card-section>
          <div class="metric-icon bg-pink text-white">
            <q-icon name="female" size="28px" />
          </div>
          <div class="text-caption text-grey-7 q-mb-xs">Mujeres</div>
          <div class="text-h3 text-weight-bold text-grey-9">{{ stats.femaleCount }}</div>
        </q-card-section>
      </q-card>

      <q-card class="metric-card col-12 col-md-6 col-xl-3 shadow-2">
        <q-card-section>
          <div class="metric-icon bg-indigo text-white">
            <q-icon name="calendar_today" size="28px" />
          </div>
          <div class="text-caption text-grey-7 q-mb-xs">Edad promedio</div>
          <div class="text-h3 text-weight-bold text-grey-9">{{ stats.averageAge }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-lg q-row-gutter-lg q-mt-lg">
      <q-card class="col-12 col-lg-5 shadow-2">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bold text-grey-9">Indicadores</div>
          </div>
          <q-badge color="primary" align="top" :label="`Total: ${totalCompanyCityCount}`" />
        </q-card-section>

        <q-separator />

        <q-card-section class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-sm-6">
            <div
              class="row items-center justify-between company-header q-mb-sm"
              @click="showCompanies = !showCompanies"
            >
              <div class="text-caption text-grey-7">Empresas</div>
              <div class="row items-center gap-xs text-caption text-grey-7">
                <span>{{ stats.companies.length }}</span>
                <q-icon :name="showCompanies ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" />
              </div>
            </div>
            <q-chip-group class="chip-wrap">
              <q-chip v-for="company in companyList" :key="company" dense outline>{{
                company
              }}</q-chip>
            </q-chip-group>
            <div
              v-if="stats.companies.length > 6"
              class="text-caption text-primary cursor-pointer q-mt-sm"
              @click="showCompanies = !showCompanies"
            >
              {{ showCompanies ? 'Ver menos' : `Ver ${stats.companies.length - 6} más` }}
            </div>
          </div>

          <div class="col-12 col-sm-6">
            <div
              class="row items-center justify-between company-header q-mb-sm"
              @click="showCities = !showCities"
            >
              <div class="text-caption text-grey-7">Ciudades</div>
              <div class="row items-center gap-xs text-caption text-grey-7">
                <span>{{ stats.cities.length }}</span>
                <q-icon :name="showCities ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" />
              </div>
            </div>
            <q-chip-group class="chip-wrap">
              <q-chip v-for="city in cityList" :key="city" dense outline>{{ city }}</q-chip>
            </q-chip-group>
            <div
              v-if="stats.cities.length > 6"
              class="text-caption text-primary cursor-pointer q-mt-sm"
              @click="showCities = !showCities"
            >
              {{ showCities ? 'Ver menos' : `Ver ${stats.cities.length - 6} más` }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-lg-7 shadow-2">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm text-grey-9">Top empresas</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div v-if="stats.usersByCompany.length === 0" class="text-caption text-grey-7 q-pa-md">
            No hay datos suficientes.
          </div>

          <div v-else>
            <div v-for="item in topCompanies" :key="item.company" class="q-mb-md">
              <div class="row items-center q-mb-xs">
                <div class="col text-weight-medium text-grey-9">{{ item.company }}</div>
                <div class="text-caption text-grey-7">{{ item.count }} usuarios</div>
              </div>
              <q-linear-progress
                :value="item.count / (stats.totalUsers || 1)"
                color="primary"
                track-color="grey-3"
                rounded
                class="company-progress"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
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

const topCompanies = computed(() => stats.value.usersByCompany.slice(0, 6))
const showCompanies = ref(false)
const showCities = ref(false)
const companyList = computed(() =>
  showCompanies.value ? stats.value.companies : stats.value.companies.slice(0, 6),
)
const cityList = computed(() =>
  showCities.value ? stats.value.cities : stats.value.cities.slice(0, 6),
)
const totalCompanyCityCount = computed(
  () => (stats.value.companies?.length || 0) + (stats.value.cities?.length || 0),
)

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
.dashboard-page {
  min-height: calc(100vh - 64px);
  background: #f4f7ff;
}

.metric-card {
  min-height: 170px;
  border-radius: 22px;
  padding: 18px;
}

.metric-icon {
  width: 55px;
  height: 55px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  margin-bottom: 16px;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
}

.bg-gradient-pink {
  background: linear-gradient(135deg, #db2777 0%, #ec4899 100%);
}

.bg-gradient-indigo {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
}

.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stats-card-title {
  font-size: 1rem;
  font-weight: 700;
}

.stat-row,
.summary-item,
.city-row,
.company-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-progress,
.company-progress {
  height: 14px;
}

.city-bar {
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.city-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
}

.summary-label {
  color: #6b7280;
}

.summary-value {
  font-weight: 700;
}

.company-name {
  min-width: 140px;
}

.company-header {
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.15s ease;
}

.company-header:hover {
  background-color: rgba(37, 99, 235, 0.06);
}
</style>
