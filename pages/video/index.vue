<script setup lang="ts">
import { FileAudio } from "lucide-vue-next";
import { formSchema } from "@/constants/video";
import { useForm } from "vee-validate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";

import Loader from "@/components/Loader.vue";
import Empty from "@/components/Empty.vue";
import Heading from "@/components/Heading.vue";

import { useMainStore } from "@/stores/main";

definePageMeta({ middleware: "auth", layout: "dashboard" });

const { setProModal, updateEventTrigger } = useMainStore();

const { toast } = useToast();

const form = useForm({
  validationSchema: formSchema,
});

const video = ref<string>();

const isLoading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  video.value = undefined;
  isLoading.value = true;

  try {
    const response = await $fetch("/api/video", {
      method: "POST",
      body: { ...values },
    });

    if (response && Array.isArray(response)) {
      video.value = response[0];
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
      title="Video Generation"
      description="Turn your prompt into video."
      :icon="FileAudio"
      iconColor="text-orange-700"
      bgColor="bg-orange-700/10"
    />
    <div class="px-4 lg:px-8">
      <form
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
                placeholder="Clown fish swimming in a coral reef"
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
        <Empty v-if="!video && !isLoading" label="No video files generated." />

        <video v-if="video" controls class="w-full mt-8">
          <source :src="video" />
        </video>
      </div>
    </div>
  </div>
</template>
