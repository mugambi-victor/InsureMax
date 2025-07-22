<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Header Section -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-icon">🛡️</div>
          <h1 class="logo-text">InsureMax</h1>
        </div>
        <h2 class="welcome-title">Welcome Back</h2>
        <p class="welcome-subtitle">Sign in to access your insurance dashboard</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-container">
            <div class="input-icon">📧</div>
            <input 
              id="email"
              v-model="username" 
              type="email" 
              placeholder="Enter your email" 
              required 
              class="form-input"
              :class="{ 'input-error': error }"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-container">
            <div class="input-icon">🔒</div>
            <input 
              id="password"
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Enter your password" 
              required 
              class="form-input"
              :class="{ 'input-error': error }"
            />
            <button 
              type="button" 
              @click="togglePassword" 
              class="password-toggle"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <p class="error-message">{{ error }}</p>
        </div>

        <!-- Login Button -->
        <button 
          type="submit" 
          :disabled="loading || !username || !password" 
          class="login-button"
        >
          <span v-if="loading" class="button-spinner"></span>
          <span class="button-text">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </span>
        </button>

        <!-- Additional Links -->
        <div class="form-footer">
          <a href="#" class="forgot-password">Forgot your password?</a>
          <div class="signup-link">
            Don't have an account? <a href="#" class="signup-text">Sign up</a>
          </div>
        </div>
      </form>

      <!-- Security Notice -->
      <div class="security-notice">
        <div class="security-icon">🔐</div>
        <p>Your connection is secured with 256-bit SSL encryption</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  error.value = '';
  loading.value = true;

  try {
    // Prepare form data
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
  params.append('client_id', import.meta.env.VITE_CLIENT_ID);
params.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

    params.append('username', username.value);
    params.append('password', password.value);
    params.append('scope', '*');

    // Send request
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/oauth/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Save token
    const token = response.data.access_token;
    localStorage.setItem('access_token', token);

    // Optional: save refresh token or expiry time if available
    // localStorage.setItem('refresh_token', response.data.refresh_token);

    // Add success animation if element exists
    const button = document.querySelector('.login-button');
    if (button) {
      button.classList.add('success');
      setTimeout(() => router.push('/products'), 500);
    } else {
      router.push('/products');
    }

  } catch (err) {
    console.error(err.response?.data || err.message);

    if (err.response?.status === 401) {
      error.value = 'Invalid email or password. Please try again.';
    } else if (err.response?.status === 429) {
      error.value = 'Too many login attempts. Please try again later.';
    } else if (err.response?.data?.error_description) {
      error.value = err.response.data.error_description;
    } else {
      error.value = 'Login failed. Please check your connection and try again.';
    }
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.login-container {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

/* Form Styles */
.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 2;
  font-size: 1.125rem;
  opacity: 0.6;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  opacity: 0.6;
  padding: 0.25rem;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.password-toggle:hover {
  opacity: 1;
}

/* Error Styles */
.error-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
}

.error-icon {
  font-size: 1.125rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

/* Login Button */
.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-button.success {
  background: #059669;
}

.button-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.button-text {
  display: flex;
  align-items: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form Footer */
.form-footer {
  text-align: center;
  font-size: 0.875rem;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  display: block;
  margin-bottom: 1rem;
}

.forgot-password:hover {
  color: #5a67d8;
}

.signup-link {
  color: #64748b;
}

.signup-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signup-text:hover {
  color: #5a67d8;
}

/* Security Notice */
.security-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.security-icon {
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-wrapper {
    padding: 0.5rem;
  }
  
  .login-container {
    padding: 2rem 1.5rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
}

/* Animation for form elements */
.form-group {
  animation: fadeInUp 0.5s ease forwards;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.login-button { animation: fadeInUp 0.5s ease 0.3s forwards; opacity: 0; }
.form-footer { animation: fadeInUp 0.5s ease 0.4s forwards; opacity: 0; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>