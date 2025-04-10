<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { storeSettings } = useAppConfig();
const route = useRoute();
const slug = route.params.slug;

// 임시 상품 데이터
const productsInCategory = ref([
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

setProducts(productsInCategory.value);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'product-category-slug') return;
    updateProductList();
  },
);

useHead({
  title: 'Products',
  meta: [{ name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="productsInCategory.length">
    <Filters v-if="storeSettings.showFilters" :hide-categories="true" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
</template>
