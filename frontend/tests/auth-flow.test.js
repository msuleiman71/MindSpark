// MindSpark Authentication Flow Test
// This test covers signup, logout, login, and guest mode functionality

const testAuthFlow = async (page) => {
  const timestamp = Date.now();
  const testEmail = `testuser${timestamp}@mindspark.com`;
  const testPassword = "testpass123";
  const testName = "Test User";

  console.log("=== STARTING AUTHENTICATION FLOW TEST ===");
  console.log(`Using test email: ${testEmail}`);

  try {
    // Set viewport for desktop testing
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 1. SIGNUP FLOW TEST
    console.log("\n--- 1. TESTING SIGNUP FLOW ---");
    
    // Navigate to signup page
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    console.log("✓ Navigated to signup page");

    // Skip tutorial modal if present
    try {
      const skipButton = page.locator('button:has-text("Skip Tutorial")');
      if (await skipButton.isVisible({ timeout: 2000 })) {
        await skipButton.click();
        console.log("✓ Skipped tutorial modal");
      }
    } catch (e) {
      console.log("ℹ No tutorial modal found or already skipped");
    }

    // Select rocket avatar
    const rocketAvatar = page.locator('button:has-text("🚀")');
    await rocketAvatar.waitFor({ state: 'visible' });
    await rocketAvatar.click();
    console.log("✓ Selected rocket avatar (🚀)");

    // Fill signup form
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    console.log("✓ Filled signup form");

    // Submit signup form
    const createAccountButton = page.locator('button:has-text("Create Account")');
    await createAccountButton.click();
    console.log("✓ Clicked Create Account button");

    // Wait for success or redirect
    try {
      // Check for success message or redirect to home
      await page.waitForURL('/', { timeout: 10000 });
      console.log("✓ Successfully redirected to home page after signup");
    } catch (e) {
      // Check if we're on success page
      const successMessage = page.locator('text=Account Created!');
      if (await successMessage.isVisible({ timeout: 5000 })) {
        console.log("✓ Account creation success message displayed");
        await page.waitForURL('/', { timeout: 10000 });
        console.log("✓ Redirected to home page");
      } else {
        throw new Error("Signup failed - no success message or redirect");
      }
    }

    // Verify user is logged in (check for user name in header)
    const welcomeText = page.locator('text=Welcome back');
    await welcomeText.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ User is logged in - Welcome back message visible");

    // Take screenshot after signup
    await page.screenshot({ 
      path: '.screenshots/01-after-signup.png', 
      quality: 40, 
      fullPage: false 
    });
    console.log("✓ Screenshot taken after signup");

    // 2. LOGOUT TEST
    console.log("\n--- 2. TESTING LOGOUT FLOW ---");
    
    // Find and click logout button
    const logoutButton = page.locator('button[title="Logout"]');
    await logoutButton.waitFor({ state: 'visible' });
    await logoutButton.click();
    console.log("✓ Clicked logout button");

    // Verify user is logged out (check for Guest Mode)
    const guestMode = page.locator('text=Guest Mode');
    await guestMode.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ User logged out - Guest Mode visible");

    // Take screenshot after logout
    await page.screenshot({ 
      path: '.screenshots/02-after-logout.png', 
      quality: 40, 
      fullPage: false 
    });
    console.log("✓ Screenshot taken after logout");

    // 3. LOGIN FLOW TEST
    console.log("\n--- 3. TESTING LOGIN FLOW ---");
    
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    console.log("✓ Navigated to login page");

    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    console.log("✓ Filled login form");

    // Submit login form
    const loginButton = page.locator('button:has-text("Login")');
    await loginButton.click();
    console.log("✓ Clicked Login button");

    // Wait for redirect to home
    await page.waitForURL('/', { timeout: 10000 });
    console.log("✓ Redirected to home page after login");

    // Verify user is logged in and name appears
    await welcomeText.waitFor({ state: 'visible', timeout: 5000 });
    const userName = page.locator(`text=${testName}`);
    await userName.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ User logged in - name appears in header");

    // Take screenshot after login
    await page.screenshot({ 
      path: '.screenshots/03-after-login.png', 
      quality: 40, 
      fullPage: false 
    });
    console.log("✓ Screenshot taken after login");

    // 4. GUEST MODE TEST
    console.log("\n--- 4. TESTING GUEST MODE ---");
    
    // Logout first
    await logoutButton.click();
    await guestMode.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ Logged out for guest mode test");

    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Click "Continue as Guest" button
    const guestButton = page.locator('button:has-text("Continue as Guest")');
    await guestButton.waitFor({ state: 'visible' });
    await guestButton.click();
    console.log("✓ Clicked Continue as Guest button");

    // Verify redirected to home and in guest mode
    await page.waitForURL('/', { timeout: 10000 });
    await guestMode.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ Successfully entered guest mode");

    // Take screenshot in guest mode
    await page.screenshot({ 
      path: '.screenshots/04-guest-mode.png', 
      quality: 40, 
      fullPage: false 
    });
    console.log("✓ Screenshot taken in guest mode");

    console.log("\n=== AUTHENTICATION FLOW TEST COMPLETED SUCCESSFULLY ===");
    return {
      success: true,
      testEmail: testEmail,
      message: "All authentication flows working correctly"
    };

  } catch (error) {
    console.error(`❌ Authentication test failed: ${error.message}`);
    
    // Take error screenshot
    await page.screenshot({ 
      path: '.screenshots/error-auth-flow.png', 
      quality: 40, 
      fullPage: false 
    });
    
    // Get error messages from page
    const errorText = await page.evaluate(() => {
      const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"], .text-red-700, .text-red-500'));
      return errorElements.map(el => el.textContent).join(", ");
    });
    
    if (errorText) {
      console.log(`Found error messages: ${errorText}`);
    }

    return {
      success: false,
      error: error.message,
      errorText: errorText,
      testEmail: testEmail
    };
  }
};

// Export for use in browser automation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAuthFlow };
}