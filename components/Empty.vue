<script setup lang="ts">
interface EmptyProps {
  label: string;
}

const { label } = defineProps<EmptyProps>();
</script>

<template>
  <div class="h-full p-20 flex flex-col items-center justify-center">
    <div class="relative h-72 w-72">
      <NuxtImg src="/images/empty.png" alt="Empty" />
    </div>
    <p class="text-muted-foreground text-sm text-center">
      {{ label }}
    </p>
  </div>
</template>
