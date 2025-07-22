<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-title">Protect What Matters Most</h1>
      <p class="hero-subtitle">Explore our trusted insurance solutions designed for every stage of life.</p>
      <div class="hero-actions">
        <button class="btn-primary">Get Started</button>
        <button class="btn-secondary">View Products</button>
      </div>
    </section>

    <!-- Products Section -->
    <section class="products-section">
      <h2 class="section-title">Our Insurance Products</h2>
      <p class="section-subtitle">Carefully crafted coverage options to suit your needs</p>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Unable to Load Products</h3>
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">Try Again</button>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-header">
            <div class="product-icon">🛡️</div>
            <div>
              <h3 class="product-name">{{ product.name }}</h3>
              <span class="product-type">{{ product.type }}</span>
            </div>
          </div>
          <div class="product-details">
            <div class="detail-item">
              <span class="detail-label">Coverage</span>
              <span class="detail-value">{{ product.coverage }}</span>
            </div>
            <div class="detail-item price-item">
              <span class="detail-label">Price</span>
              <span class="price">${{ formatPrice(product.price) }}</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn-primary">Get Quote</button>
            <button class="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Products Available</h3>
        <p>We're working on adding new insurance products. Check back soon!</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 SecureLife Insurance. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const loading = ref(true)
const error = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const fetchProducts = async () => {
  const token = localStorage.getItem('access_token')
  
  if (!token) {
    error.value = 'Please log in to view products.'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''
    
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
  headers: { Authorization: `Bearer ${token}` },
});

    
    products.value = res.data || []
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please log in again.'
    } else if (err.response?.status === 403) {
      error.value = 'You don\'t have permission to view products.'
    } else {
      error.value = 'Failed to load products. Please check your connection.'
    }
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

const retryFetch = () => {
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
 width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #64748b;
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 3rem 2rem;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.error-container p {
  color: #7f1d1d;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.product-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.product-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
}

.product-type {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-details {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  color: #1a202c;
  font-weight: 600;
}

.price-item {
  background: #f8fafc;
  margin: 0 -1rem;
  padding: 1rem;
  border-radius: 8px;
  border: none;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
}

.landing-page {
  background-color: #f8fafc;
  margin: 0 !important;
  padding: 0 !important;
}

/* Hero Section */
.hero {
  width: 100vw;
  min-height: 50vh; /* Optional: makes it full screen height */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}


.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.products-section {
  padding: 4rem 2rem;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.section-subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
}

.footer {
  background: #1e293b;
  color: #cbd5e1;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.875rem;
  margin-top: 3rem;
}


/* Responsive Design */
@media (max-width: 768px) {
  .products-container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .product-card {
    padding: 1.5rem;
  }
  
  .product-actions {
    flex-direction: column;
  }

  
}
</style>