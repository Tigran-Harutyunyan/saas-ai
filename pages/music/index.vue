<script setup lang="ts">
import { Music } from "lucide-vue-next";
import { formSchema } from "@/constants/music";
import { useForm } from "vee-validate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";

import Loader from "@/components/Loader.vue";
import Empty from "@/components/Empty.vue";
import Heading from "@/components/Heading.vue";

import { useMainStore } from "@/stores/main";

useHead({
  title: "AI genius | Music",
});

definePageMeta({ middleware: "auth", layout: "dashboard" });

const { setProModal, updateEventTrigger } = useMainStore();

const { toast } = useToast();

const form = useForm({
  validationSchema: formSchema,
});

const music = ref<string>();

const isLoading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  music.value = undefined;
  isLoading.value = true;

  try {
    const response = await $fetch("/api/music", {
      method: "POST",
      body: { ...values },
    });

    if (response && typeof response === "object" && "audio" in response) {
      music.value = response.audio;
    }
  } catch (error) {
    if (error?.response?.status === 403) {
      setProModal(true);
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  } finally {
    isLoading.value = false;
    updateEventTrigger();
  }
});
</script>

<template>
  <div>
    <Heading
      title="Music Generation"
      description="Turn your prompt into music."
      :icon="Music"
      iconColor="text-emerald-500"
      bgColor="bg-emerald-500/10"
    />
    <div class="px-4 lg:px-8">
      <form
        lg:px-8
        @submit.prevent="onSubmit"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <FormField name="prompt" v-slot="{ componentField }">
          <FormItem class="col-span-12 lg:col-span-10">
            <FormControl class="m-0">
              <Input
                class="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                v-bind="componentField"
                :disabled="isLoading"
                placeholder="Piano solo"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <Button
          class="col-span-12 lg:col-span-2 w-full"
          type="submit"
          :disabled="isLoading"
          size="icon"
        >
          Generate
        </Button>
      </form>
      <div class="space-y-4 mt-4">
        <div v-if="isLoading" class="p-20">
          <Loader />
        </div>
        <Empty v-if="!music && !isLoading" label="No music file generated." />

        <audio v-if="music" controls class="w-full mt-8">
          <source :src="music" />
        </audio>
      </div>
    </div>
  </div>
</template>
