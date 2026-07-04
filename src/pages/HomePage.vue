<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-weight-bold q-mb-md">Directorio Corporativo</div>

    <div class="text-subtitle2 text-grey-7 q-mb-lg">Consulta de colaboradores registrados</div>

    <UserTable @view-user="abrirDetalle" />

    <UserDetailDialog v-model="dialog" :user-id="userId" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

import UserTable from 'src/components/UserTable.vue'
import UserDetailDialog from 'src/components/UserDetailDialog.vue'

const dialog = ref(false)

const userId = ref(null)

const abrirDetalle = (usuario) => {
  console.log('Usuario seleccionado')

  console.log(usuario)

  userId.value = usuario.id
  dialog.value = true
}
</script>
