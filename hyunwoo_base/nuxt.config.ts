import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-03-30',
  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  experimental: {
    sharedPrerenderData: true,
    buildCache: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
      },
    },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: ['woonuxt-settings', '@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n'],

  alias: {
    '#constants': resolve('./app/constants'),
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      addPage('product-page-pager', '/products/page/:pageNumber', 'products.vue');
      addPage('product-category-page', '/product-category/:categorySlug', 'product-category/[slug].vue');
      addPage('product-category-page-pager', '/product-category/:categorySlug/page/:pageNumber', 'product-category/[slug].vue');
      addPage('order-received', '/checkout/order-received/:orderId', 'order-summary.vue');
      addPage('order-summary', '/order-summary/:orderId', 'order-summary.vue');
    },
  },

  nitro: {
    preset: 'firebase',
    routeRules: {
      '/checkout/order-received/**': { ssr: false },
      '/order-summary/**': { ssr: false },
      // 404 페이지를 위한 룰 추가
      '/**': { ssr: true }
    },
  },

  // 정적 사이트 생성 설정
  ssr: true,
  generate: {
    // Nuxt 3에서는 routes만 지정 가능
    routes: ['/']
  },

  // Multilingual support
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: [
      { code: 'en_US', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de_DE', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es_ES', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr_FR', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it_IT', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt_BR', file: 'pt-BR.json', name: 'Português 🇧🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'en_US',
    strategy: 'no_prefix',
    restructureDir: false,
  },

  css: [resolve('./app/assets/css/main.css')],
});
