<script setup lang="ts">
import { Zap } from "lucide-vue-next";
import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useMainStore } from "@/stores/main";

const { setProModal } = useMainStore();

interface FreeCounterProps {
  isPro: boolean;
  apiLimitCount: number;
}

const { isPro, apiLimitCount } = defineProps<FreeCounterProps>();
</script>

<template>
  <div class="px-3" v-if="!isPro">
    <Card class="bg-white/10 border-0">
      <CardContent class="py-6">
        <div class="text-center text-sm text-white mb-4 space-y-2">
          <p>{{ apiLimitCount }} / {{ MAX_FREE_COUNTS }} Free Generations</p>

          <Progress
            class="h-3"
            :model-value="(apiLimitCount / MAX_FREE_COUNTS) * 100"
          />
        </div>
        <Button @click="setProModal(true)" variant="premium" class="w-full">
          Upgrade
          <Zap class="w-4 h-4 ml-2 fill-white" />
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
