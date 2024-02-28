<script setup lang="ts">
import { Download, ImageIcon } from "lucide-vue-next";
import { useClerkProvide } from "vue-clerk";
import {
  amountOptions,
  formSchema,
  resolutionOptions,
} from "@/constants/images";
import { useForm } from "vee-validate";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const photos = ref<string[]>([]);

const isLoading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;

  photos.value = [];

  try {
    const response = await $fetch("/api/image", {
      method: "POST",
      body: { ...values },
    });

    if (response && Array.isArray(response)) {
      const urls = response.map((image: { url: string }) => image.url);
      photos.value = urls;
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
      title="Image Generation"
      description="Turn your prompt into an image."
      :icon="ImageIcon"
      iconColor="text-pink-700"
      bgColor="bg-pink-700/10"
    />
    <div class="px-4 lg:px-8">
      <form
        @submit.prevent="onSubmit"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <FormField name="prompt" v-slot="{ componentField }">
          <FormItem class="col-span-12 lg:col-span-6">
            <FormControl class="m-0">
              <Input
                class="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                v-bind="componentField"
                :disabled="isLoading"
                placeholder="A picture of a horse in Swiss alps"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="amount" v-slot="{ componentField }">
          <FormItem class="col-span-12 lg:col-span-6">
            <Select :disabled="isLoading" v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in amountOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormField name="resolution" v-slot="{ componentField }">
          <FormItem class="col-span-12 lg:col-span-6">
            <Select :disabled="isLoading" v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in resolutionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
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
        <Empty
          v-if="photos.length === 0 && !isLoading"
          label="No images generated."
        />
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8"
        >
          <Card
            key="src"
            class="rounded-lg overflow-hidden"
            v-for="src in photos"
          >
            <div class="relative aspect-square">
              <NuxtImg fill alt="Generated" :src="src" />
            </div>
            <CardFooter class="p-2">
              <a :href="src" download target="_blank">
                <Button variant="secondary" class="w-full">
                  <Download class="h-4 w-4 mr-2" />
                  Download
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
