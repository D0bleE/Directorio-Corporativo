<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-white">
          Directorio de colaboradores
        </div>

        <div class="text-subtitle2 text-grey-4">
          Consulta de colaboradores registrados
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="compare_arrows"
          label="Comparar usuarios"
          no-caps
          to="/comparacion"
        />

        <q-btn
          color="primary"
          icon="dashboard"
          label="Ver dashboard"
          no-caps
          to="/dashboard"
        />
      </div>
    </div>

    <UserTable @view-user="abrirDetalle" />
  </q-page>
</template>

<script setup>
import UserTable from 'src/components/UserTable.vue'

const abrirDetalle = (usuario) => {
  console.log('Usuario seleccionado:', usuario)

  // Aquí el Integrante 3 abrirá el QDialog
}
</script>