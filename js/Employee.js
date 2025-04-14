let employees = [
    { username: "beptruong01", password: "123456", name: "Nguyễn Văn Bếp", position: "Bếp", phone: "0912345678" },
    { username: "phucvu01", password: "abc123", name: "Trần Thị Phục Vụ", position: "Phục vụ", phone: "0987654321" },
    { username: "thungan01", password: "mkthu123", name: "Lê Thị Thu Ngân", position: "Thu ngân", phone: "0909090909" },
    { username: "phucvu02", password: "pass2024", name: "Phạm Minh Phục Vụ", position: "Phục vụ", phone: "0933222111" },
  ];

  function renderTable() {
    const table = document.getElementById('employeeTable');
    table.innerHTML = '';
    employees.forEach((emp, index) => {
      table.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${emp.username}</td>
          <td><input type="password" class="form-control" value="${emp.password}" disabled></td>
          <td>${emp.name}</td>
          <td>${emp.position}</td>
          <td>${emp.phone}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="openEditModal(${index})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${index})">Xóa</button>
          </td>
        </tr>
      `;
    });
  }

  function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Thêm nhân viên';
    document.getElementById('editingIndex').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
    document.getElementById('position').value = '';
    document.getElementById('phone').value = '';
  }

  function openEditModal(index) {
    const emp = employees[index];
    document.getElementById('modalTitle').textContent = 'Sửa nhân viên';
    document.getElementById('editingIndex').value = index;
    document.getElementById('username').value = emp.username;
    document.getElementById('password').value = emp.password;
    document.getElementById('name').value = emp.name;
    document.getElementById('position').value = emp.position;
    document.getElementById('phone').value = emp.phone;
    new bootstrap.Modal(document.getElementById('employeeModal')).show();
  }

  function saveEmployee(event) {
    event.preventDefault();
    const index = document.getElementById('editingIndex').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const phone = document.getElementById('phone').value;
    const newEmp = { username, password, name, position, phone };
    if (index === '') {
      employees.push(newEmp);
    } else {
      employees[index] = newEmp;
    }
    renderTable();
    bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
  }

  function deleteEmployee(index) {
    if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      employees.splice(index, 1);
      renderTable();
    }
  }

  renderTable();