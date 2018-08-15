const changePasswordBtn = document.querySelector('#password-change');
let changePassword = false;

if (changePasswordBtn) {
  changePasswordBtn.addEventListener('click', (event) => {
    event.preventDefault();
    changePassword = !changePassword;

    if (changePassword) {
      const passwordTemplate = document.querySelector('#password-change-template');
      changePasswordBtn.parentElement.insertAdjacentHTML('beforeend', passwordTemplate.innerHTML);
      changePasswordBtn.textContent = 'Cancel password change';
    } else {
      const fields = document.querySelectorAll('.password-form .form-field');
      fields.forEach(f => f.remove());
      changePasswordBtn.textContent = 'Change password';
    }
  });
}
