/**
 * Menu Drink Management Module
 * Handles the display and management of drink items in the restaurant menu
 */

// Drink data structure
const drinkList = [
  {
    id: 1,
    name: "CÀ PHÊ SỮA ĐÁ",
    price: 15000,
    formattedPrice: "15.000₫",
    description: "1 ly Cà Phê Sữa Đá",
    image: "../img/ThucUong1.jpg",
    category: "tea",
    isAvailable: true,
    isHot: false,
    isAlcoholic: false
  },
  {
    id: 2,
    name: "TRÀ HOA SEN",
    price: 20000,
    formattedPrice: "20.000₫",
    description: "1 ly Trà Hoa Sen",
    image: "../img/ThucUong2.jpg",
    category: "coffee",
    isAvailable: true,
    isHot: false,
    isAlcoholic: false
  },
];

// DOM Elements
const drinkContainer = document.querySelector('#drinkItems');
const drinkModal = document.getElementById('drinkModal');
const drinkForm = document.getElementById('drinkForm');
const searchDrinkInput = document.getElementById('searchDrinkInput');

// Format price to Vietnamese currency
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Create drink card HTML
function createDrinkCard(drink) {
  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="position-relative">
          <img src="${drink.image}" class="card-img-top" alt="${drink.name}" style="height: 200px; object-fit: cover;">
          ${drink.isHot ? '<span class="badge bg-warning position-absolute top-0 end-0 m-2">Nóng</span>' : ''}
          ${drink.isAlcoholic ? '<span class="badge bg-danger position-absolute top-0 start-0 m-2">Có cồn</span>' : ''}
          ${!drink.isAvailable ? '<div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"><span class="badge bg-secondary">Hết hàng</span></div>' : ''}
        </div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${drink.name}</h5>
            <span class="price fw-bold text-primary">${drink.formattedPrice}</span>
          </div>
          <p class="card-text text-muted flex-grow-1">${drink.description}</p>
          <div class="d-flex justify-content-between mt-3">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="openEditDrinkModal(${drink.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteDrink(${drink.id})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${drink.id})" ${!drink.isAvailable ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Search drink by query, trả về list kết quả
function searchDrinkList(query) {
  const q = query.toLowerCase().trim();
  return drinkList.filter(drink =>
    drink.name.toLowerCase().includes(q) ||
    drink.description.toLowerCase().includes(q)
  );
}

// Render drink items từ list truyền vào
function renderDrinkItems(list) {
  if (!drinkContainer) return;
  drinkContainer.innerHTML = '';
  list.forEach(drink => {
    drinkContainer.innerHTML += createDrinkCard(drink);
  });
}

// Lưu lại từ khóa tìm kiếm hiện tại
let currentDrinkSearch = '';

// Xử lý tìm kiếm
function handleDrinkSearch() {
  const searchTerm = searchDrinkInput.value;
  currentDrinkSearch = searchTerm;
  const result = searchDrinkList(searchTerm);
  renderDrinkItems(result);
}

// Add drink to cart
function addToCart(drinkId) {
  const drink = drinkList.find(item => item.id === drinkId);
  if (!drink) return;
  
  // Get current cart from localStorage or initialize empty array
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === drinkId && item.type === 'drink');
  
  if (existingItemIndex >= 0) {
    // Increment quantity if item exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cart.push({
      id: drink.id,
      type: 'drink',
      name: drink.name,
      price: drink.price,
      image: drink.image,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show success message
  showToast('Đã thêm đồ uống vào giỏ hàng');
}

// Customize drink (placeholder for future implementation)
function customizeDrink(drinkId) {
  const drink = drinkList.find(item => item.id === drinkId);
  if (!drink) return;
  
  // This would open a customization modal in a real implementation
  console.log(`Customizing drink: ${drink.name}`);
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

// Thêm hàm mở modal sửa đồ uống
function openEditDrinkModal(drinkId) {
  const drink = drinkList.find(item => item.id === drinkId);
  if (!drink) return;
  
  document.getElementById('drinkName').value = drink.name;
  document.getElementById('drinkPrice').value = drink.price;
  document.getElementById('drinkDesc').value = drink.description;
  document.getElementById('editDrinkId').value = drink.id;
  
  // Show current image preview
  const imagePreview = document.getElementById('drinkImagePreview');
  imagePreview.src = drink.image;
  imagePreview.style.display = 'block';
  
  document.getElementById('modalDrinkTitle').textContent = 'Sửa đồ uống';
  const modal = new bootstrap.Modal(drinkModal);
  modal.show();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderDrinkItems(drinkList);
  if (searchDrinkInput) {
    searchDrinkInput.addEventListener('input', handleDrinkSearch);
  }
  if (drinkForm) {
    drinkForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Lấy dữ liệu form
      const name = document.getElementById('drinkName').value.trim();
      const price = parseInt(document.getElementById('drinkPrice').value);
      const description = document.getElementById('drinkDesc').value.trim();
      const imageFile = document.getElementById('drinkImage').files[0];
      const editDrinkId = document.getElementById('editDrinkId').value;
      
      // Validate input
      if (!name || !price || !description) {
        showToast('Vui lòng điền đầy đủ thông tin đồ uống');
        return;
      }
      if (price <= 0) {
        showToast('Giá đồ uống phải lớn hơn 0');
        return;
      }
      // Kiểm tra trùng tên
      const isDuplicate = drinkList.some((drink) =>
        drink.name.toLowerCase() === name.toLowerCase() && drink.id != editDrinkId
      );
      if (isDuplicate) {
        showToast('Tên đồ uống đã tồn tại!');
        return;
      }

      // Function to save drink with image
      const saveDrink = (imageData) => {
        // Tạo object mới
        const newDrink = {
          id: editDrinkId === '' ? (drinkList.length > 0 ? Math.max(...drinkList.map(d => d.id)) + 1 : 1) : parseInt(editDrinkId),
          name: name.toUpperCase(),
          price: price,
          formattedPrice: formatPrice(price),
          description: description,
          image: imageData,
          category: 'other',
          isAvailable: true,
          isHot: false,
          isAlcoholic: false
        };
        if (editDrinkId === '') {
          drinkList.push(newDrink);
          showToast('Đã thêm đồ uống mới vào thực đơn');
        } else {
          const index = drinkList.findIndex(d => d.id === parseInt(editDrinkId));
          if (index !== -1) {
            drinkList[index] = newDrink;
            showToast('Đã cập nhật thông tin đồ uống');
          }
        }
        // Re-render drink items
        const result = searchDrinkList(currentDrinkSearch);
        renderDrinkItems(result);
        // Reset form và đóng modal
        drinkForm.reset();
        document.getElementById('editDrinkId').value = '';
        document.getElementById('drinkImagePreview').style.display = 'none';
        const modal = bootstrap.Modal.getInstance(drinkModal);
        modal.hide();
      };

      // Handle image
      if (imageFile) {
        // If new image is selected, convert it to base64
        const reader = new FileReader();
        reader.onload = function(e) {
          saveDrink(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else if (editDrinkId !== '') {
        // If editing and no new image, keep the existing image
        const existingDrink = drinkList.find(d => d.id === parseInt(editDrinkId));
        if (existingDrink) {
          saveDrink(existingDrink.image);
        }
      } else {
        showToast('Vui lòng chọn ảnh cho đồ uống');
      }
    });
  }
});

function deleteDrink(drinkId) {
  if (confirm('Bạn có chắc muốn xóa đồ uống này?')) {
    const index = drinkList.findIndex(item => item.id === drinkId);
    if (index !== -1) {
      drinkList.splice(index, 1);
      const result = searchDrinkList(currentDrinkSearch);
      renderDrinkItems(result);
      showToast('Đã xóa đồ uống khỏi thực đơn');
    }
  }
}