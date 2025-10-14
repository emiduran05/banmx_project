describe('Pantalla de Login', () => {
  it('Debe permitir escribir el email y password y presionar el login', async () => {
    const emailInput = await $('~input-email');
    const passwordInput = await $('~input-password');
    const loginButton = await $('~btn-login');

    await emailInput.setValue('test@test.com');
    await passwordInput.setValue('123456');
    await loginButton.click();

    // Espera que se muestre un error o navegue
    const errorMessage = await $('~error-message');
    console.log(await errorMessage.getText());
  });
});
