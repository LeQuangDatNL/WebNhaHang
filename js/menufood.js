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
const searchInput = document.getElementById('searchInput');

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
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="openEditModal(${food.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteFood(${food.id})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${food.id})" ${!food.isAvailable ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Search food by query, trả về list kết quả
function searchFoodList(query) {
  const q = query.toLowerCase().trim();
  return foodList.filter(food =>
    food.name.toLowerCase().includes(q) ||
    food.description.toLowerCase().includes(q)
  );
}

// Render food items từ list truyền vào
function renderFoodItems(list) {
  if (!foodContainer) return;
  foodContainer.innerHTML = '';
  list.forEach(food => {
    foodContainer.innerHTML += createFoodCard(food);
  });
}

// Lưu lại từ khóa tìm kiếm hiện tại
let currentFoodSearch = '';

// Xử lý tìm kiếm
function handleFoodSearch() {
  const searchTerm = searchInput.value;
  currentFoodSearch = searchTerm;
  const result = searchFoodList(searchTerm);
  renderFoodItems(result);
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

// Function to open edit modal
function openEditModal(foodId) {
  const food = foodList.find(item => item.id === foodId);
  if (!food) return;
  
  document.getElementById('foodName').value = food.name;
  document.getElementById('foodPrice').value = food.price;
  document.getElementById('foodDesc').value = food.description;
  document.getElementById('editIndex').value = food.id;
  
  // Show current image preview
  const imagePreview = document.getElementById('foodImagePreview');
  imagePreview.src = food.image;
  imagePreview.style.display = 'block';
  
  // Update modal title
  document.getElementById('modalTitle').textContent = 'Sửa món ăn';
  
  // Show modal
  const modal = new bootstrap.Modal(foodModal);
  modal.show();
}

// Function to delete food
function deleteFood(foodId) {
  if (confirm('Bạn có chắc muốn xóa món ăn này?')) {
    const index = foodList.findIndex(item => item.id === foodId);
    if (index !== -1) {
      foodList.splice(index, 1);
      const result = searchFoodList(currentFoodSearch);
      renderFoodItems(result);
      showToast('Đã xóa món ăn khỏi thực đơn');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderFoodItems(foodList);
  if (searchInput) {
    searchInput.addEventListener('input', handleFoodSearch);
  }
  if (foodForm) {
    foodForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form values
      const name = document.getElementById('foodName').value.trim();
      const price = parseInt(document.getElementById('foodPrice').value);
      const description = document.getElementById('foodDesc').value.trim();
      const imageFile = document.getElementById('foodImage').files[0];
      const editIndex = document.getElementById('editIndex').value;
      
      // Validate input
      if (!name || !price || !description) {
        showToast('Vui lòng điền đầy đủ thông tin món ăn');
        return;
      }
      
      if (price <= 0) {
        showToast('Giá món ăn phải lớn hơn 0');
        return;
      }

      // Check for duplicate name
      const isDuplicate = foodList.some((food, index) => 
        food.name.toLowerCase() === name.toLowerCase() && index !== parseInt(editIndex)
      );
      
      if (isDuplicate) {
        showToast('Tên món ăn đã tồn tại!');
        return;
      }

      // Function to save food with image
      const saveFood = (imageData) => {
        // Create new food object
        const newFood = {
          id: editIndex === '' ? (foodList.length > 0 ? Math.max(...foodList.map(f => f.id)) + 1 : 1) : parseInt(editIndex),
          name: name.toUpperCase(),
          price: price,
          formattedPrice: formatPrice(price),
          description: description,
          image: imageData,
          isAvailable: true,
          isSpicy: false,
          isVegetarian: false
        };
        
        if (editIndex === '') {
          // Add new food
          foodList.push(newFood);
          showToast('Đã thêm món mới vào thực đơn');
        } else {
          // Update existing food
          const index = foodList.findIndex(f => f.id === parseInt(editIndex));
          if (index !== -1) {
            foodList[index] = newFood;
            showToast('Đã cập nhật thông tin món ăn');
          }
        }
        
        // Re-render food items
        const result = searchFoodList(currentFoodSearch);
        renderFoodItems(result);
        
        // Reset form and hide modal
        foodForm.reset();
        document.getElementById('editIndex').value = '';
        document.getElementById('foodImagePreview').style.display = 'none';
        const modal = bootstrap.Modal.getInstance(foodModal);
        modal.hide();
      };

      // Handle image
      if (imageFile) {
        // If new image is selected, convert it to base64
        const reader = new FileReader();
        reader.onload = function(e) {
          saveFood(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else if (editIndex !== '') {
        // If editing and no new image, keep the existing image
        const existingFood = foodList.find(f => f.id === parseInt(editIndex));
        if (existingFood) {
          saveFood(existingFood.image);
        }
      } else {
        showToast('Vui lòng chọn ảnh cho món ăn');
      }
    });
  }
});