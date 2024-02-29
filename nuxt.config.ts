// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt-alt/markdown-it', '@nuxtjs/google-fonts', '@fixers/nuxt-stripe', '@pinia/nuxt', "@nuxt/image", '@vueuse/nuxt', '@vee-validate/nuxt'],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg', href: '/images/logo.png' }
      ],
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  alias: {
    ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
  },
  runtimeConfig: {
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      unsplashAccessKey: process.env.NUXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      crisp: process.env.CRISP
    },
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    stripeKey: process.env.STRIPE_API_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  googleFonts: {
    subsets: 'latin',
    families: {
      Poppins: {
        wght: [200, 300, 400, 500, 600, 700, 800, 900],
      },
      Montserrat: {
        wght: [600],
      },
    }
  },
  markdownit: {
    runtime: true,
    use: ['markdown-it-highlightjs']
  }

});
