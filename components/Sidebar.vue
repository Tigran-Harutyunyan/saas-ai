<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-vue-next";

interface SidebarProps {
  isPro: boolean;
  apiLimitCount: number;
}

const { isPro, apiLimitCount } = defineProps<SidebarProps>();

interface route {
  label: string;
  icon: any;
  href: string;
  color?: string;
}

const routes = ref<route[]>([
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    href: "/code",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    href: "/music",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]);

const currentRoute = useRoute();
</script>

<template>
  <div class="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
    <div class="px-3 py-2 flex-1">
      <NuxtLink to="/dashboard" class="flex items-center pl-3 mb-14">
        <div class="relative h-8 w-8 mr-4">
          <NuxtImg fill alt="Logo" src="/images/logo.png" />
        </div>
        <h1 class="text-2xl font-bold font-poppins">Genius</h1>
      </NuxtLink>
      <div class="space-y-1">
        <NuxtLink
          v-for="route in routes"
          :key="route.href"
          :to="route.href"
          :class="
            cn(
              'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
              currentRoute.path === route.href
                ? 'text-white bg-white/10'
                : 'text-zinc-400'
            )
          "
        >
          <div class="flex items-center flex-1">
            <component
              :is="route.icon"
              :class="cn('h-5 w-5 mr-3', route.color)"
            />
            {{ route.label }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <ClientOnly>
      <FreeCounter :apiLimitCount="apiLimitCount" :isPro="isPro"
    /></ClientOnly>
  </div>
</template>
