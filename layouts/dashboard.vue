<script setup lang="ts">
import { ClerkLoaded } from "vue-clerk";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

import { useMainStore } from "@/stores/main";

const { aiUsageEventTrigger } = storeToRefs(useMainStore());

const { setPro } = useMainStore();

const apiLimitCount = ref(0);

const isPro = ref(true);

const { data: isProData } = useLazyAsyncData("isProData", () =>
  $fetch("/api/subscription/check")
);

const { data: countData, refresh } = useLazyAsyncData(
  "countData",
  () => $fetch("/api/limitcount"),
  {
    server: false,
  }
);

watch(countData, (newCount) => {
  if (typeof newCount === "number") {
    apiLimitCount.value = newCount;
  }
});

watch(isProData, (newVal) => {
  if (typeof newVal === "boolean") {
    isPro.value = newVal;
    setPro(newVal);
  }
});

watch(
  () => aiUsageEventTrigger.value,
  () => {
    refresh();
  }
);
</script>

<template>
  <ClerkLoaded>
    <div class="h-full relative">
      <div
        class="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900"
      >
        <Sidebar :isPro="isPro" :apiLimitCount="apiLimitCount" />
      </div>
      <main class="md:pl-72 pb-10">
        <Navbar :isPro="isPro" />
        <slot />
      </main>
    </div>
    <ProModal />
    <!-- <CrispChat /> -->
  </ClerkLoaded>
</template>
