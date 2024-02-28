<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const router = useRouter();

interface ToolCardProps {
  src: string;
  href: string;
  title: string;
  description: string;
  premium?: boolean;
}
const { src, href, title, description, premium } = defineProps<ToolCardProps>();

const onClick = () => {
  router.push(href);
};
</script>

<template>
  <Card @click="onClick" class="group cursor-pointer">
    <CardHeader>
      <CardTitle class="text-lg font-bold flex items-center">
        <div
          class="relative h-8 w-8 mr-2 group-hover:scale-125 transition duration-150"
        >
          <NuxtImg alt="Icon" :src="src" fill />
        </div>
        {{ title }}
      </CardTitle>
      <CardDescription>{{ description }}</CardDescription>

      <CardContent class="p-0" v-if="premium">
        <Badge variant="premium" class="uppercase">pro</Badge>
      </CardContent>
    </CardHeader>
  </Card>
</template>
