<template>
  <q-page class="page-home q-pa-lg">
    <div class="row justify-between items-end q-mb-md">
      <div>
        <div class="text-h3 text-white">Directorio de colaboradores</div>
        <div class="text-subtitle1 text-grey-3">Consulta de colaboradores registrados</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-row-gutter-md menu-grid">
      <div v-for="item in menuItems" :key="item.label" class="col-6 col-sm-4 col-md-3 col-lg-2">
        <q-card flat bordered class="menu-card">
          <q-card-section class="row items-center justify-center q-pa-md">
            <q-avatar size="72px" class="bg-white text-primary shadow-2">
              <q-icon :name="item.icon" size="36px" />
            </q-avatar>
          </q-card-section>
          <q-card-section class="text-center text-white text-weight-medium q-pa-sm">
            {{ item.label }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mt-md">
      <q-separator />
    </div>
    <div class="q-mt-md">
      <UserTable @view-user="abrirDetalle" />
    </div>
  </q-page>
</template>

<script setup>
import UserTable from 'src/components/UserTable.vue'

const abrirDetalle = (usuario) => {
  console.log('Usuario seleccionado', usuario)
}
</script>
