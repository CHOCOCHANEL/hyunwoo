<script lang="ts" setup>
// 임시 카테고리 데이터
const productCategories = ref([
  {
    id: '1',
    name: 'Category 1',
    slug: 'category-1',
    image: {
      sourceUrl: '/images/category1.jpg',
      altText: 'Category 1'
    }
  },
  {
    id: '2',
    name: 'Category 2',
    slug: 'category-2',
    image: {
      sourceUrl: '/images/category2.jpg',
      altText: 'Category 2'
    }
  },
  {
    id: '3',
    name: 'Category 3',
    slug: 'category-3',
    image: {
      sourceUrl: '/images/category3.jpg',
      altText: 'Category 3'
    }
  }
]);

useHead({
  title: `Categories`,
  meta: [{ name: 'description', content: 'All product categories' }],
  link: [{ rel: 'canonical', href: 'https://v3.woonuxt.com/categories' }],
});
</script>

<template>
  <main class="container">
    <div v-if="productCategories?.length" class="grid grid-cols-2 gap-4 my-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-4">
      <CategoryCard v-for="(category, i) in productCategories" :key="i" :node="category" :image-loading="i <= 2 ? 'eager' : 'lazy'" />
    </div>
  </main>
</template>
