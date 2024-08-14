<script setup lang="ts">
import type { Quote } from "../types/Quote";
import QuoteCard from "./QuoteCard.vue";
import FavoriteQuotesList from "./FavoriteQuotesList.vue";

const favoriteQuotesKey = "favoriteQuotes";

const favoriteQuotes = ref<Quote[]>([]);
const isQuoteSaved = ref(false);
const showFavorites = ref(false);

const {
  data: quote,
  refresh,
  status,
} = await useFetch<Quote>("/api/fetchQuote");

onMounted(() => {
  getFavoriteQuotes();
  // refetch a new quote every minute
  const intervalId = setInterval(refresh, 60000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

// get favorite quotes from local storage
const getFavoriteQuotes = () => {
  const favorites = localStorage.getItem(favoriteQuotesKey);
  const favoritesArray = favorites ? JSON.parse(favorites) : [];
  favoriteQuotes.value = favoritesArray;
};

// save the displayed quote to favorites
const addFavorite = () => {
  if (quote.value) {
    const savedQuotes = localStorage.getItem(favoriteQuotesKey);
    const savedQuotesArray = savedQuotes ? JSON.parse(savedQuotes) : [];
    const favoriteQuote = quote.value;

    if (!savedQuotesArray.includes(favoriteQuote)) {
      savedQuotesArray.push(favoriteQuote);
      localStorage.setItem(favoriteQuotesKey, JSON.stringify(savedQuotesArray));
      favoriteQuotes.value = savedQuotesArray;
    }
  }
};

// remove quote from favorites
const removeFavorite = (quote: Quote) => {
  const savedQuotes = localStorage.getItem(favoriteQuotesKey);
  const savedQuotesArray = savedQuotes ? JSON.parse(savedQuotes) : [];

  const favoritesUpdated = savedQuotesArray.filter(
    (savedQuote: Quote) => savedQuote.id !== quote.id
  );

  localStorage.setItem(favoriteQuotesKey, JSON.stringify(favoritesUpdated));
  favoriteQuotes.value = favoritesUpdated;
};

// clear all favorites
const clearFavorites = () => {
  localStorage.removeItem(favoriteQuotesKey);
  favoriteQuotes.value = [];
};

// toggle the display of favorite quotes card
const toggleFavorites = () => {
  showFavorites.value = !showFavorites.value;
};

watchEffect(() => {
  isQuoteSaved.value = favoriteQuotes.value.some(
    (fav) => fav.id === quote.value?.id
  );
});
</script>

<template>
  <v-container>
    <QuoteCard
      :quote="quote"
      :status="status"
      :is-quote-saved="isQuoteSaved"
      @refresh="refresh"
      @add-favorite="addFavorite"
      @remove-favorite="removeFavorite"
    />
    <v-card
      v-if="favoriteQuotes.length"
      max-width="800"
      class="mx-auto toggle-button-wrapper"
    >
      <v-btn class="card-button" @click="toggleFavorites">
        {{
          showFavorites
            ? `Hide Favorite Quotes`
            : `Show Favorite Quotes (${favoriteQuotes.length})`
        }}
      </v-btn>
    </v-card>
    <FavoriteQuotesList
      :favorite-quotes="favoriteQuotes"
      :show-favorites="showFavorites"
      @remove-favorite="removeFavorite"
      @clear-favorites="clearFavorites"
    />
  </v-container>
</template>

<style>
.card-button {
  background-color: #5ad795;
}

.toggle-button-wrapper {
  box-shadow: none;
}
</style>
