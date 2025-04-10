<script setup lang="ts">
const { scrollToTop } = useHelpers();

// 임시 다운로드 데이터
const downloads = ref([
  {
    id: '1',
    name: 'Sample Download 1',
    downloadUrl: '#',
    expires: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    remainingDownloads: 5
  },
  {
    id: '2',
    name: 'Sample Download 2',
    downloadUrl: '#',
    expires: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    remainingDownloads: 3
  }
]);

const refresh = () => {
  scrollToTop();
  // 임시로 데이터를 다시 로드하는 것처럼 보이게 함
  downloads.value = [...downloads.value];
};
</script>

<template>
  <div class="bg-white rounded-lg flex shadow min-h-[250px] p-4 md:p-12 justify-center items-center">
    <div v-if="downloads && downloads.length" class="w-full">
      <DownloadableItems :downloadableItems="downloads" />
      <div class="text-center flex justify-center w-full mt-8">
        <button type="button" @click="refresh" class="flex items-center gap-1 text-sm leading-none hover:bg-gray-50 p-2 rounded">
          <span>Refresh list</span>
          <Icon name="ion:refresh-outline" />
        </button>
      </div>
    </div>
    <div v-else-if="downloads && downloads.length === 0" class="min-h-[250px] flex items-center justify-center text-gray-500 text-lg">No downloads found.</div>
    <LoadingIcon v-else size="24" stroke="2" />
  </div>
</template>
