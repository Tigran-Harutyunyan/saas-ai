<script setup lang="ts">
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Check, Zap } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/constants";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMainStore } from "@/stores/main";

const { toast } = useToast();

const { showProDialog } = storeToRefs(useMainStore());

const loading = ref(false);

const onSubscribe = async () => {
  try {
    loading.value = true;
    let response = await $fetch("/api/stripe", {
      method: "post",
    });

    if (typeof response === "object" && response && "url" in response) {
      window.location.href = response.url as string;
    }
  } catch (error) {
    toast({
      description: "Something went wrong",
      variant: "destructive",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Dialog v-model:open="showProDialog">
    <DialogContent>
      <DialogHeader class="space-y-4">
        <DialogTitle
          class="flex justify-center items-center flex-col gap-y-4 pb-2"
        >
          <div class="flex items-center gap-x-2 font-bold text-xl">
            Upgrade to Genius
            <Badge variant="premium" class="uppercase text-sm py-1">
              pro
            </Badge>
          </div>
        </DialogTitle>
        <DialogDescription
          class="text-center pt-2 space-y-2 text-zinc-900 font-medium"
        >
          <Card
            v-for="tool in tools"
            :key="tool.href"
            class="p-3 border-black/5 flex items-center justify-between"
          >
            <div class="flex items-center gap-x-4">
              <div :class="cn('p-2 w-fit rounded-md', tool.bgColor)">
                <component :is="tool.icon" :class="cn('w-6 h-6', tool.color)" />
              </div>
              <div class="font-semibold text-sm">
                {{ tool.label }}
              </div>
            </div>
            <Check class="text-primary w-5 h-5" />
          </Card>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          :disabled="loading"
          @click="onSubscribe"
          size="lg"
          variant="premium"
          class="w-full"
        >
          {{ loading ? "Redirecting..." : "Upgrade" }}
          <Zap class="w-4 h-4 ml-2 fill-white" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
