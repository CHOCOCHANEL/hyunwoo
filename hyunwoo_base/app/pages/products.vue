<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

// 임시 데이터로 대체
const allProducts = ref([
  {
    id: 1,
    name: 'Product 1',
    price: '29.99',
    image: { sourceUrl: '/images/product1.jpg' },
    stockStatus: 'instock'
  },
  {
    id: 2,
    name: 'Product 2',
    price: '39.99',
    image: { sourceUrl: '/images/product2.jpg' },
    stockStatus: 'instock'
  },
  {
    id: 3,
    name: 'Product 3',
    price: '49.99',
    image: { sourceUrl: '/images/product3.jpg' },
    stockStatus: 'instock'
  }
]);

setProducts(allProducts.value);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: `Products`,
  meta: [{ name: 'description', content: 'Discover our products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="allProducts.length">
    <Filters v-if="storeSettings.showFilters" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>Could not fetch products from your store. Please check your configuration.</NoProductsFound>
</template>
