<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  {
    src: '/images/hero-door.png',
    title: 'Just landed.',
    subtitle: 'The New Year Collection',
    description: 'Our latest collection is here. Discover the latest trends and styles for the new year.'
  },
  {
    src: '/images/hero-abs-01.png',
    title: 'Summer Collection',
    subtitle: 'New Arrivals',
    description: 'Explore our new summer collection with the latest designs and styles.'
  },
  {
    src: '/images/hero-abs-02.png',
    title: 'Winter Special',
    subtitle: 'Limited Edition',
    description: 'Special winter collection with exclusive items and offers.'
  },
  {
    src: '/images/hero-middle-sliding-01.png',
    title: 'Middle Sliding',
    subtitle: 'Limited Edition',
    description: 'Special winter collection with exclusive items and offers.'
  }
];

const currentSlide = ref(0);
let slideInterval: NodeJS.Timeout;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const startSlideShow = () => {
  slideInterval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 변경
};

onMounted(() => {
  startSlideShow();
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<template>
  <div class="relative mx-auto h-[550px] lg:h-[750px] xl:h-[850px] overflow-hidden">
    <TransitionGroup name="slide" tag="div" class="relative h-full">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        v-show="currentSlide === index"
        class="absolute inset-0 transition-opacity duration-1000"
        :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
      >
        <NuxtImg
          width="1920"
          height="1080"
          class="object-cover w-full h-full"
          :src="slide.src"
          :alt="`Hero image ${index + 1}`"
          loading="eager"
          sizes="sm:100vw md:1400px"
          fetchpriority="high"
          preload
          placeholder
          placeholder-class="blur-xl"
        />
        <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none">
          <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">{{ slide.title }}</h1>
          <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">{{ slide.subtitle }}</h2>
          <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
            <p>{{ slide.description }}</p>
          </div>
          <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800" to="/products">Shop now</NuxtLink>
        </div>
      </div>
    </TransitionGroup>
    
    <!-- 슬라이드 인디케이터 -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="w-3 h-3 rounded-full transition-colors"
        :class="currentSlide === index ? 'bg-white' : 'bg-white/50'"
        @click="currentSlide = index"
      />
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
