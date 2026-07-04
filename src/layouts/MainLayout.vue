<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-gutter-sm">
        <q-toolbar-title class="row items-center q-gutter-sm">
          <q-icon name="shopping_cart" size="28px" />
          <div class="column">
            <div class="text-h6">Dummy</div>
            <div class="text-caption">Oficina Principal</div>
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <div class="text-caption">ADMIN</div>
          <q-avatar color="white" text-color="primary">A</q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>
