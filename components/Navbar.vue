<script setup lang="ts">
import { UserButton } from "vue-clerk";
import MobileSidebar from "@/components/MobileSidebar.vue";

interface NavbarProps {
  isPro?: boolean;
}
const { isPro } = defineProps<NavbarProps>();
</script>

<template>
  <div class="flex items-center p-4">
    <ClientOnly>
      <MobileSidebar :isPro="isPro" />
    </ClientOnly>
    <div class="flex w-full justify-end">
      <UserButton after-sign-out-url="/" />
    </div>
  </div>
</template>
