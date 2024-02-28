<script setup lang="ts">
import { Button } from "@/components/ui/button";

import { useClerkProvide } from "vue-clerk";

const { derivedState } = useClerkProvide();

const isAuth = computed(() => {
  return !!derivedState.value?.userId;
});
</script>

<template>
  <nav class="p-4 bg-transparent flex items-center justify-between">
    <Link href="/" class="flex items-center">
      <div class="relative h-8 w-8 mr-4">
        <NuxtImg fill alt="Logo" src="/images/logo.png" />
      </div>
      <h1 class="text-2xl font-bold text-white font-montserrat">Genius</h1>
    </Link>
    <div class="flex items-center gap-x-2">
      <NuxtLink :to="isAuth ? '/dashboard' : '/sign-in'">
        <Button variant="outline" class="rounded-full">Sign-in</Button>
      </NuxtLink>
    </div>
  </nav>
</template>
