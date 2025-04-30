import axios from 'axios';
import pLimit from 'p-limit';

const TOTAL_REQUESTS = 10_000_000; // 10 million requests
const BATCH_SIZE = 100_000; // 100k requests per batch
const CONCURRENCY_LIMIT = 5000; // Maximum concurrent requests per batch
const API_URL = 'http://localhost:5000/api/invoices';

const limit = pLimit(CONCURRENCY_LIMIT); // Limit concurrency

// Random price and item generators
function getRandomPrice(min = 100, max = 5000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem() {
  const descriptions = ['Consulting', 'Software Dev', 'Support', 'Training', 'Design', 'Analysis'];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const amount = getRandomPrice();
  return { description, amount };
}

// Send invoice function
async function sendInvoice(i) {
  const invoiceNumber = `INV-${Date.now()}-${i}`;
  const items = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, getRandomItem);
  const body = {
    invoiceNumber,
    clientName: `Client ${i}`,
    tradeName: `Trade ${i}`,
    gstin: "27AAAAA0000A1Z5",
    address: "Mumbai, India",
    gstType: "IGST",
    items,
    status: "Pending"
  };

  try {
    await axios.post(API_URL, body);
    return { success: true, id: i };
  } catch (err) {
    return { success: false, id: i, error: err.response?.data?.message || err.message };
  }
}

// Run stress test with batching
async function runStressTest() {
  console.time("Stress Test Duration");

  let totalSuccess = 0;
  let totalFailed = 0;

  // Create batches for sending requests in chunks
  for (let batchStart = 0; batchStart < TOTAL_REQUESTS; batchStart += BATCH_SIZE) {
    const promises = [];

    for (let i = batchStart; i < Math.min(batchStart + BATCH_SIZE, TOTAL_REQUESTS); i++) {
      promises.push(limit(() => sendInvoice(i)));
    }

    // Wait for all promises in this batch to resolve
    const results = await Promise.allSettled(promises);
    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    totalSuccess += success;
    totalFailed += failed;

    console.log(`Batch ${batchStart}-${batchStart + BATCH_SIZE - 1} | ✅ ${success} | ❌ ${failed}`);
  }

  console.log(`Total Success: ${totalSuccess} | Total Failed: ${totalFailed}`);
  console.timeEnd("Stress Test Duration");
}

runStressTest();
