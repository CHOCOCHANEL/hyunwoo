<script setup lang="ts">
// 임시 enum 정의
enum StockStatusEnum {
  IN_STOCK = 'instock',
  OUT_OF_STOCK = 'outofstock',
  ON_BACKORDER = 'onbackorder'
}

defineProps({
  stockStatus: { type: String, required: false },
});
</script>

<template>
  <span v-if="stockStatus === StockStatusEnum.IN_STOCK" class="text-green-600">{{ $t('messages.shop.inStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.OUT_OF_STOCK" class="text-red-600">{{ $t('messages.shop.outOfStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.ON_BACKORDER" class="text-yellow-600">{{ $t('messages.shop.onBackorder') }}</span>
  <span v-else class="text-gray-600">Loading</span>
</template>
