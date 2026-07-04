<template>
  <q-dialog v-model="modelValue" persistent maximized>
    <q-card>
      <q-bar class="bg-primary text-white">
        <div class="text-h6">Detalle del Usuario</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section v-if="loading" class="text-center">
        <q-spinner size="50px" color="primary" />
      </q-card-section>

      <q-card-section v-else-if="usuario" class="q-pa-lg">
        <div class="row q-col-gutter-xl">
          <!-- Imagen -->
          <div class="col-12 col-md-3">
            <q-card bordered class="full-height">
              <div class="text-center q-pt-lg">
                <q-avatar size="180px">
                  <img :src="usuario.image" style="object-fit: cover" />
                </q-avatar>
              </div>

              <q-card-section class="text-center">
                <div class="text-h6 text-weight-bold">
                  {{ usuario.firstName }} {{ usuario.lastName }}
                </div>

                <div class="text-grey-7 q-mt-sm">
                  {{ usuario.email }}
                </div>

                <q-separator class="q-my-md" />

                <div>
                  <strong>Usuario:</strong>
                  {{ usuario.username }}
                </div>

                <div class="q-mt-sm">
                  <strong>Nacimiento:</strong>
                  {{ usuario.birthDate }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Información -->
          <div class="col-12 col-md-9">
            <q-list bordered separator>
              <q-item-label header>
                <q-icon name="person" class="q-mr-sm" />

                Datos personales
              </q-item-label>

              <q-item>
                <q-item-section> <strong>Edad:</strong> {{ usuario.age }} </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <strong>Género:</strong>

                    <q-badge
                      :color="usuario.gender === 'male' ? 'primary' : 'pink'"
                      class="q-ml-sm"
                    >
                      {{ usuario.gender }}
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section> <strong>Teléfono:</strong> {{ usuario.phone }} </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Grupo sanguíneo:</strong> {{ usuario.bloodGroup }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="business" class="q-mr-sm" />
                Información laboral
              </q-item-label>

              <q-item>
                <q-item-section>
                  <strong>Empresa:</strong> {{ usuario.company.name }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Cargo:</strong> {{ usuario.company.title }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Departamento:</strong>
                  {{ usuario.company.department }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="location_on" class="q-mr-sm" />

                Dirección
              </q-item-label>

              <q-item>
                <q-item-section>
                  <strong>Dirección:</strong>

                  {{ usuario.address.address }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Ubicación:</strong>

                  {{ usuario.address.city }}, {{ usuario.address.state }},
                  {{ usuario.address.country }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="school" class="q-mr-sm" />
                Universidad
              </q-item-label>

              <q-item>
                {{ usuario.university }}
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="account_balance" class="q-mr-sm" />
                Banco
              </q-item-label>

              <q-item>
                <q-item-section>
                  <strong>Tipo de tarjeta:</strong>
                  {{ usuario.bank.cardType }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Número:</strong>
                  {{ usuario.bank.cardNumber }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Moneda:</strong>
                  {{ usuario.bank.currency }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="fitness_center" class="q-mr-sm" />
                Información física
              </q-item-label>

              <q-item>
                <q-item-section>
                  <strong>Altura:</strong>
                  {{ usuario.height }} cm
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Peso:</strong>
                  {{ usuario.weight }} kg
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Color de ojos:</strong>
                  {{ usuario.eyeColor }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Color de cabello:</strong>
                  {{ usuario.hair.color }}
                  ({{ usuario.hair.type }})
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item-label header>
                <q-icon name="currency_bitcoin" class="q-mr-sm" />
                Criptomonedas
              </q-item-label>

              <q-item>
                <q-item-section>
                  <strong>Moneda:</strong>
                  {{ usuario.crypto.coin }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Wallet:</strong>
                  {{ usuario.crypto.wallet }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <strong>Red:</strong>
                  {{ usuario.crypto.network }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getUserById } from 'src/services/userService'

const props = defineProps({
  modelValue: Boolean,
  userId: Number,
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)

const usuario = ref(null)

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(
  () => props.userId,
  async (id) => {
    if (!id) return

    loading.value = true

    usuario.value = await getUserById(id)

    loading.value = false
  },
)
</script>
