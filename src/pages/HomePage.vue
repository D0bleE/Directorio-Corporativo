<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold">Directorio Corporativo</div>
        <div class="text-subtitle2 text-grey-7">Consulta de colaboradores registrados</div>
      </div>

      <q-btn label="Ver Dashboard" color="primary" to="/dashboard" rounded unelevated />
    </div>

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
