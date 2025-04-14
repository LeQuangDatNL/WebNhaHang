/**
 * Menu Food Management Module
 * Handles the display and management of food items in the restaurant menu
 */

// Food data structure
const foodList = [
  {
    id: 1,
    name: "GỎI TÔM",
    price: 29000,
    formattedPrice: "29.000₫",
    description: "1 phần 4 gỏi tôm",
    image: "../img/mon1.jpg",
    isAvailable: true,
    isSpicy: true,
    isVegetarian: false
  },
  {
    id: 2,
    name: "BÁNH CUỐN NÓNG",
    price: 35000,
    formattedPrice: "35.000₫",
    description: "1 phần 3 bánh cuốn",
    image: "../img/mon2.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false
  },
  {
    id: 3,
    name: "BÚN BÒ",
    price: 45000,
    formattedPrice: "45.000₫",
    description: "Bùn bò (đặc biệt)",
    image: "../img/mon3.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false
  },
  {
    id: 4,
    name: "BÚN GIÒ",
    price: 99000,
    formattedPrice: "99.000₫",
    description: "Bún giò (đặc biệt)",
    image: "../img/mon4.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false
  },
  {
    id: 5,
    name: "BÁNH CUỐN TÔM",
    price: 55000,
    formattedPrice: "55.000₫",
    description: "1 phần 5 bánh cuốn tôm",
    image: "../img/mon5.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false
  }
];

// DOM Elements
const foodContainer = document.querySelector('#foodItems');
const foodModal = document.getElementById('foodModal');
const foodForm = document.getElementById('foodForm');

// Format price to Vietnamese currency
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Create food card HTML
function createFoodCard(food) {
  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="position-relative">
          <img src="${food.image}" class="card-img-top" alt="${food.name}" style="height: 200px; object-fit: cover;">
          ${food.isSpicy ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Cay</span>' : ''}
          ${!food.isAvailable ? '<div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"><span class="badge bg-secondary">Hết hàng</span></div>' : ''}
        </div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${food.name}</h5>
            <span class="price fw-bold text-primary">${food.formattedPrice}</span>
          </div>
          <p class="card-text text-muted flex-grow-1">${food.description}</p>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-outline-primary btn-sm" onclick="customizeFood(${food.id})">
              <i class="bi bi-gear"></i> Tuỳ chỉnh
            </button>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${food.id})" ${!food.isAvailable ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render all food items
function renderFoodItems() {
  if (!foodContainer) return;
  
  foodContainer.innerHTML = '';
  foodList.forEach(food => {
    foodContainer.innerHTML += createFoodCard(food);
  });
}

// Add food to cart
function addToCart(foodId) {
  const food = foodList.find(item => item.id === foodId);
  if (!food) return;
  
  // Get current cart from localStorage or initialize empty array
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === foodId && item.type === 'food');
  
  if (existingItemIndex >= 0) {
    // Increment quantity if item exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cart.push({
      id: food.id,
      type: 'food',
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show success message
  showToast('Đã thêm món vào giỏ hàng');
}

// Customize food (placeholder for future implementation)
function customizeFood(foodId) {
  const food = foodList.find(item => item.id === foodId);
  if (!food) return;
  
  // This would open a customization modal in a real implementation
  console.log(`Customizing food: ${food.name}`);
  showToast('Tính năng tuỳ chỉnh đang được phát triển');
}

// Show toast notification
function showToast(message) {
  // Check if toast container exists, create if not
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastId = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  toast.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">Thông báo</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Initialize and show toast
  const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
  bsToast.show();
  
  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderFoodItems();
  
  // Add event listener for food form submission
  if (foodForm) {
    foodForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form values
      const name = document.getElementById('foodName').value;
      const price = parseInt(document.getElementById('foodPrice').value);
      const description = document.getElementById('foodDesc').value;
      const image = document.getElementById('foodImage').value;
      const section = document.getElementById('currentSection').value;
      const editIndex = document.getElementById('editIndex').value;
      
      // Create new food object
      const newFood = {
        id: foodList.length > 0 ? Math.max(...foodList.map(f => f.id)) + 1 : 1,
        name: name.toUpperCase(),
        price: price,
        formattedPrice: formatPrice(price),
        description: description,
        image: image,
        category: 'other',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: false
      };
      
      // Add to food list
      foodList.push(newFood);
      
      // Re-render food items
      renderFoodItems();
      
      // Hide modal
      const modal = bootstrap.Modal.getInstance(foodModal);
      modal.hide();
      
      // Show success message
      showToast('Đã thêm món mới vào thực đơn');
    });
  }
});