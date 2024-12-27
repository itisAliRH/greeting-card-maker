// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: {
    enabled: true,
  },

  modules: ["@nuxtjs/tailwindcss"],
  compatibilityDate: "2024-12-27",
});