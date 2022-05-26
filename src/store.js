import { Redis } from "@upstash/redis/fastly";

// The name of the backend providing the Upstash Redis service.
const UPSTASH_BACKEND = "upstash";

const CURSOR_KEY = "queue:cursor";
const LENGTH_KEY = "queue:length";

// Get the current queue cursor, i.e. how many visitors have been let in
export async function getQueueCursor(store) {
  return parseInt((await store.get(CURSOR_KEY)) || 0);
}

// Increment the current queue cursor, letting in `amt` visitors.
//
// Returns the new cursor value.
export async function incrementQueueCursor(store, amt) {
  return await store.incrby(CURSOR_KEY, amt);
}

// Get the current length of the queue. Subtracting the cursor from this
// shows how many visitors are waiting.
export async function getQueueLength(store) {
  return parseInt(await store.get(LENGTH_KEY));
}

// Add a visitor to the queue.
//
// Returns the new queue length.
export async function addToQueue(store) {
  return await store.incr(LENGTH_KEY);
}

// Helper function for configuring a Redis client.
export function getStore(config) {
  return new Redis({
    url: config.upstash.url,
    token: config.upstash.token,
    backend: UPSTASH_BACKEND,
  });
}