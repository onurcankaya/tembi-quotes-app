<script setup lang="ts">
import type { Quote } from "../types/Quote";

defineProps<{
  favoriteQuotes: Quote[];
  showFavorites: Boolean;
}>();

const emit = defineEmits(["remove-favorite", "clear-favorites"]);

const removeFavorite = (quote: Quote) => emit("remove-favorite", quote);
const clearFavorites = (quote: Quote) => emit("clear-favorites", quote);
</script>

<template>
  <v-card
    v-if="favoriteQuotes.length && showFavorites"
    class="mx-auto px-4 py-4 d-flex flex-column align-center favorites-card"
    max-width="800"
  >
    <v-card-title class="favorites-heading">Favorite Quotes</v-card-title>
    <v-card-text>
      <v-list class="d-flex flex-column mt-4 favorites-list">
        <div v-for="(fav, index) in favoriteQuotes" :key="index">
          <div
            class="d-flex flex-row justify-space-between favorites-list-item"
          >
            <div class="d-flex flex-column favorite-wrapper">
              <p class="favorite-quote">{{ `"${fav.q}"` }}</p>
              <p class="favorite-author">{{ `—${fav.a}` }}</p>
            </div>
            <v-btn
              class="card-button"
              icon="mdi-trash-can"
              size="small"
              @click="removeFavorite(fav)"
            >
            </v-btn>
          </div>
        </div>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn class="card-button" @click="clearFavorites">
        <v-icon icon="mdi-trash-can" class="mr-1" />
        Clear Favorites
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.favorites-card {
  border: 2px solid #5ad795;
}

.favorites-list {
  gap: 2rem;
}

.favorites-list-item {
  gap: 3rem;
  border: 1px solid #5ad795;
  padding: 2rem;
  border-radius: 0.5rem;
}

.favorites-heading {
  font-size: 1.5rem;
  font-weight: bold;
}

.favorite-wrapper {
  gap: 0.5rem;
}

.favorite-quote {
  font-size: 1rem;
  font-style: italic;
}

.favorite-author {
  font-size: 1rem;
  font-weight: bold;
}
</style>
