<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-weight-bold q-mb-md">Directorio Corporativo</div>

    <div class="text-subtitle2 text-grey-7 q-mb-lg">Consulta de colaboradores registrados</div>

    <UserTable @view-user="abrirDetalle" />
  </q-page>
</template>

<script setup>
import UserTable from 'src/components/UserTable.vue'

const abrirDetalle = (usuario) => {
  console.log('Usuario seleccionado')

  console.log(usuario)

  // Aquí el Integrante 3 abrirá el QDialog
}
</script>
