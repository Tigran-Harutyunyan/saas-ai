<script setup lang="ts">
import { Settings } from "lucide-vue-next";
import { useMainStore } from "@/stores/main";
definePageMeta({ middleware: "auth", layout: "dashboard" });

useHead({
  title: "AI genius | Settings",
});

const { isPro } = storeToRefs(useMainStore());
</script>

<template>
  <div>
    <Heading
      title="Settings"
      description="Manage account settings."
      :icon="Settings"
      iconColor="text-gray-700"
      bgColor="bg-gray-700/10"
    />
    <div class="px-4 lg:px-8 space-y-4">
      <div class="text-muted-foreground text-sm">
        {{
          isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."
        }}
      </div>
      <SubscriptionButton :isPro="isPro" />
    </div>
  </div>
</template>
