<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });
useHead({
  title: "Ai genius | Dashboard",
});
import { ArrowRight } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tools } from "@/constants";

const router = useRouter();
</script>

<template>
  <NuxtPage />
  <div>
    <div class="mb-8 space-y-4">
      <h2 class="text-2xl md:text-4xl font-bold text-center">
        Explore the power of AI
      </h2>
      <p
        class="text-muted-foreground font-light text-sm md:text-lg text-center"
      >
        Chat with the smartest AI - Experience the power of AI
      </p>
    </div>
    <div class="px-4 md:px-20 lg:px-32 space-y-4">
      <Card
        v-for="tool in tools"
        @click="router.push(tool.href)"
        :key="tool.href"
        class="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
      >
        <div class="flex items-center gap-x-4">
          <div :class="cn('p-2 w-fit rounded-md', tool.bgColor)">
            <component :is="tool.icon" :class="cn('w-8 h-8', tool.color)" />
          </div>
          <div class="font-semibold">
            {{ tool.label }}
          </div>
        </div>
        <ArrowRight class="w-5 h-5" />
      </Card>
    </div>
  </div>
</template>
