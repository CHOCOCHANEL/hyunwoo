<script lang="ts" setup>
const { siteName, description, shortDescription, siteImage } = useAppConfig();

// 임시 데이터로 대체
const productCategories = [
  { name: 'Category 1', slug: 'category-1', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Category 2', slug: 'category-2', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Category 3', slug: 'category-3', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Category 4', slug: 'category-4', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Category 5', slug: 'category-5', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Category 6', slug: 'category-6', image: { sourceUrl: '/images/placeholder.jpg' } }
];

const popularProducts = [
  { name: 'Product 1', slug: 'product-1', price: '100', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Product 2', slug: 'product-2', price: '200', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Product 3', slug: 'product-3', price: '300', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Product 4', slug: 'product-4', price: '400', image: { sourceUrl: '/images/placeholder.jpg' } },
  { name: 'Product 5', slug: 'product-5', price: '500', image: { sourceUrl: '/images/placeholder.jpg' } }
];

useSeoMeta({
  title: `Home`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <HeroBanner />

    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.shopByCategory') }}</h2>
        <NuxtLink class="text-primary" to="/categories">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <div class="grid justify-center grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-6">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
    </section>

    <section class="container grid gap-4 my-24 md:grid-cols-2 lg:grid-cols-4">
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/box.svg" width="60" height="60" alt="Free Shipping" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Free Shipping</h3>
          <p class="text-sm">Free shipping on order over €50</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/moneyback.svg" width="60" height="60" alt="Money Back" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Peace of Mind</h3>
          <p class="text-sm">30 days money back guarantee</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/secure.svg" width="60" height="60" alt="Secure Payment" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">100% Payment Secure</h3>
          <p class="text-sm">Your payment are safe with us.</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img src="/icons/support.svg" width="60" height="60" alt="Support 24/7" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Support 24/7</h3>
          <p class="text-sm">24/7 Online support</p>
        </div>
      </div>
    </section>

    <section class="container my-16" v-if="popularProducts">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.popularProducts') }}</h2>
        <NuxtLink class="text-primary" to="/products">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <ProductRow :products="popularProducts" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8" />
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}
</style>
