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
  console.log('Usuario seleccionado:', usuario)

  userId.value = usuario.id
  dialog.value = true
}
</script>
