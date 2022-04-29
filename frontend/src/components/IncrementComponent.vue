<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import Pusher from 'pusher-js'

  let count = ref<number>(0)
  let id = ref<number>(0)
  const isDisabled = ref<boolean>(false)

  const appKey = import.meta.env.VITE_PUSHER_APP_KEY ?? ''

  const socket = new Pusher(appKey, {
    cluster: 'eu',
  })

  const channel = socket.subscribe('counter-channel')

  onMounted(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => {
        count.value = data.counter
        id.value = data.id
      })
    channel.bind('update-event', (d: { updatedCounter: number }) => {
      count.value = d.updatedCounter
    })
  })

  const action = async (type: string) => {
    if (id.value === 0) {
      alert('The database table does not have any records!')
      return
    }
    type === 'increment' ? count.value++ : count.value--
    isDisabled.value = true

    fetch(`/api/${id.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ counter: count.value }),
    })
      .then(() => {
        isDisabled.value = false
        channel.bind(
          'update-event',
          function (res: { updatedCounter: number }) {
            count.value = res.updatedCounter
          }
        )
      })
      .catch(() => {
        type === 'increment' ? count.value-- : count.value++
        isDisabled.value = false
      })
  }
</script>

<template>
  <span class="count">{{ count }}</span>
  <div v-if="id !== 0" class="button-row">
    <button :disabled="isDisabled" @click="action('decrement')">-</button>
    <button :disabled="isDisabled" @click="action('increment')">+</button>
  </div>
  <div v-else>
    <p>There is no record in database!</p>
  </div>
</template>
