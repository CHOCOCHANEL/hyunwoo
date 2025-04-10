<script lang="ts" setup>
// 임시 enum 정의
enum StockStatusEnum {
  IN_STOCK = 'instock',
  OUT_OF_STOCK = 'outofstock',
  ON_BACKORDER = 'onbackorder'
}

enum ProductTypesEnum {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
  GROUPED = 'grouped',
  EXTERNAL = 'external'
}

// 임시 타입 정의
interface AddToCartInput {
  productId: number;
  quantity: number;
  variationId?: number;
  variation?: Record<string, string>;
}

interface Variation {
  id: number;
  databaseId: number;
  attributes: Record<string, string>;
  price: string;
  stockStatus: StockStatusEnum;
}

interface Product {
  id: number;
  databaseId: number;
  name: string;
  price: string;
  stockStatus: StockStatusEnum;
  type: ProductTypesEnum;
  description: string;
  shortDescription?: string;
  image?: { sourceUrl: string };
  galleryImages?: { sourceUrl: string }[];
  sku?: string;
  averageRating?: number;
  reviewCount?: number;
  salePrice?: string;
  regularPrice?: string;
  externalUrl?: string;
  buttonText?: string;
  productCategories?: {
    nodes: Array<{
      databaseId: number;
      slug: string;
      name: string;
    }>;
  };
  related?: {
    nodes: Array<{
      id: number;
      name: string;
      price: string;
      image?: { sourceUrl: string };
    }>;
  };
  variations?: {
    nodes: Variation[];
  };
}

const route = useRoute();
const { storeSettings } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const slug = route.params.slug as string;

// 임시 데이터로 대체
const product = ref<Product>({
  id: 1,
  databaseId: 1,
  name: 'Sample Product',
  price: '29.99',
  stockStatus: StockStatusEnum.IN_STOCK,
  type: ProductTypesEnum.SIMPLE,
  description: 'This is a sample product description.',
  shortDescription: 'Short description of the sample product.',
  image: { sourceUrl: '/images/sample1.jpg' },
  galleryImages: [
    { sourceUrl: '/images/sample1.jpg' },
    { sourceUrl: '/images/sample2.jpg' }
  ],
  sku: 'SKU123',
  averageRating: 4.5,
  reviewCount: 10,
  salePrice: '24.99',
  regularPrice: '29.99',
  productCategories: {
    nodes: [
      {
        databaseId: 1,
        slug: 'category-1',
        name: 'Category 1'
      },
      {
        databaseId: 2,
        slug: 'category-2',
        name: 'Category 2'
      }
    ]
  },
  related: {
    nodes: [
      {
        id: 2,
        name: 'Related Product 1',
        price: '39.99',
        image: { sourceUrl: '/images/related1.jpg' }
      },
      {
        id: 3,
        name: 'Related Product 2',
        price: '49.99',
        image: { sourceUrl: '/images/related2.jpg' }
      }
    ]
  },
  variations: {
    nodes: [
      {
        id: 1,
        databaseId: 1,
        attributes: { color: 'red', size: 'M' },
        price: '29.99',
        stockStatus: StockStatusEnum.IN_STOCK
      },
      {
        id: 2,
        databaseId: 2,
        attributes: { color: 'blue', size: 'L' },
        price: '34.99',
        stockStatus: StockStatusEnum.IN_STOCK
      }
    ]
  }
});

const quantity = ref<number>(1);
const activeVariation = ref<Variation | undefined>(undefined);
const variation = ref<VariationAttribute[]>([]);
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const type = computed(() => activeVariation.value || product.value);
const selectProductInput = computed<AddToCartInput>(() => ({
  productId: type.value?.databaseId || 0,
  quantity: quantity.value,
  variationId: activeVariation.value?.databaseId,
  variation: activeVariation.value ? attrValues.value : undefined
}));

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;

  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

// GraphQL 쿼리 대신 임시 데이터 사용
onMounted(() => {
  // 임시로 재고 상태 업데이트
  setTimeout(() => {
    mergeLiveStockStatus({
      ...product.value,
      stockStatus: StockStatusEnum.IN_STOCK
    });
  }, 1000);
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      // Set the value of the variation of type ANY to ''
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));

      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  // Set variation to the selected variation if it exists
  activeVariation.value = getActiveVariation?.[0] || undefined;

  selectProductInput.value.variationId = activeVariation.value?.databaseId;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : undefined;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !type.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <div v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb :product class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <ProductImageGallery
          v-if="product.image"
          class="relative flex-1"
          :main-image="product.image"
          :gallery="product.galleryImages!"
          :node="type"
          :activeVariation="activeVariation || {}" />
        <NuxtImg v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />

        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold">
                {{ type.name }}
                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>
              </h1>
              <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" v-if="storeSettings.showReviews" />
            </div>
            <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
          </div>

          <div class="grid gap-2 my-8 text-sm empty:hidden">
            <div v-if="!isExternalProduct" class="flex items-center gap-2">
              <span class="text-gray-400">{{ $t('messages.shop.availability') }}: </span>
              <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
            </div>
            <div class="flex items-center gap-2" v-if="storeSettings.showSKU && product.sku">
              <span class="text-gray-400">{{ $t('messages.shop.sku') }}: </span>
              <span>{{ product.sku || 'N/A' }}</span>
            </div>
          </div>

          <div class="mb-8 font-light prose" v-html="product.shortDescription || product.description" />

          <hr />

          <form @submit.prevent="addToCart(selectProductInput)">
            <AttributeSelections
              v-if="isVariableProduct && product.attributes && product.variations"
              class="mt-4 mb-8"
              :attributes="product.attributes.nodes"
              :defaultAttributes="product.defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations" />
            <div
              v-if="isVariableProduct || isSimpleProduct"
              class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 bg-white md:static md:bg-transparent bg-opacity-90 md:p-0">
              <input
                v-model="quantity"
                type="number"
                min="1"
                aria-label="Quantity"
                class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
              <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
            </div>
            <a
              v-if="isExternalProduct && product.externalUrl"
              :href="product.externalUrl"
              target="_blank"
              class="rounded-lg flex font-bold bg-gray-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none">
              {{ product?.buttonText || 'View product' }}
            </a>
          </form>

          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories">
            <div class="grid gap-2 my-8 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-gray-400">{{ $t('messages.shop.category', 2) }}:</span>
                <div class="product-categories">
                  <NuxtLink
                    v-for="category in product.productCategories.nodes"
                    :key="category.databaseId"
                    :to="`/product-category/${decodeURIComponent(category?.slug || '')}`"
                    class="hover:text-primary"
                    :title="category.name"
                    >{{ category.name }}<span class="comma">, </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <hr />
          </div>

          <div class="flex flex-wrap gap-4">
            <WishlistButton :product />
            <ShareButton :product />
          </div>
        </div>
      </div>
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product />
      </div>
      <div class="my-32" v-if="product.related && storeSettings.showRelatedProducts">
        <div class="mb-4 text-xl font-semibold">{{ $t('messages.shop.youMayLike') }}</div>
        <LazyProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>
