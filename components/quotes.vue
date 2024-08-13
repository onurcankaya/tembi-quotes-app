<script setup lang="ts">
import type { Quote } from "../types/Quote";
import tembiLogo from "/assets/tembi-logo.svg";

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
    <v-card
      class="d-flex flex-column mx-auto mb-12 px-4 py-4 quotes-card"
      max-width="800"
      append-icon="tembiLogo"
    >
      <template v-slot:prepend>
        <v-img :width="150" :src="tembiLogo" alt="Tembi Logo" />
      </template>

      <v-card-text>
        <div v-if="status === 'pending'">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>
        <div v-else-if="quote.error" class="error-wrapper">
          <p class="error-message">{{ quote.error }}</p>
        </div>
        <div
          v-else-if="status === 'success' && quote"
          class="d-flex flex-column align-center quote-wrapper"
        >
          <p class="quote-text">{{ `"${quote.q}"` }}</p>
          <p class="quote-author">{{ `—${quote.a}` }}</p>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex flex-column flex-sm-row">
        <v-btn class="mb-2 mb-sm-0 card-button" @click="refresh">
          <v-icon icon="mdi-autorenew" class="mr-1" />
          Fetch New Quote
        </v-btn>
        <v-btn
          v-if="isQuoteSaved && quote"
          class="mb-2 mb-sm-0 card-button"
          @click="removeFavorite(quote)"
        >
          <v-icon icon="mdi-heart" class="mr-1" />
        </v-btn>
        <v-btn
          v-else
          :disabled="!!quote.error"
          class="mb-2 mb-sm-0 card-button"
          @click="addFavorite"
        >
          <v-icon icon="mdi-heart-outline" class="mr-1" />
        </v-btn>
      </v-card-actions>
    </v-card>

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
  </v-container>
</template>

<style scoped>
.quotes-card {
  gap: 2.5rem;
  border: 2px solid #5ad795;
  background-color: rgba(90, 215, 149, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-title {
  font-size: 1.5rem;
}

.quote-wrapper {
  gap: 1rem;
  max-width: 500px;
}

.quote-text {
  font-size: 1.25rem;
  font-style: italic;
  text-align: center;
}

.quote-author {
  font-size: 1rem;
  font-weight: bold;
}

.error-wrapper {
  padding: 1rem 2rem;
  border: 1px solid #f75143;
  background-color: #fbdedb;
  border-radius: 0.25rem;
}

.error-message {
  font-size: 1rem;
  color: #f75143;
}

.card-button {
  background-color: #5ad795;
}

.toggle-button-wrapper {
  box-shadow: none;
}

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
