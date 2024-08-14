<script setup lang="ts">
import type { Quote } from "../types/Quote";
import tembiLogo from "/assets/tembi-logo.svg";

defineProps<{
  quote: Quote;
  status: String;
  isQuoteSaved: Boolean;
}>();

const emit = defineEmits(["refresh", "add-favorite", "remove-favorite"]);

const fetchNewQuote = () => emit("refresh");
const addFavorite = () => emit("add-favorite");
const removeFavorite = (quote: Quote) => emit("remove-favorite", quote);
</script>

<template>
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
      <v-btn class="mb-2 mb-sm-0 card-button" @click="fetchNewQuote">
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
</style>
