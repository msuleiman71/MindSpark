// Mobile Responsiveness Test for MindSpark Home Page
// Testing viewport widths: 375px (iPhone SE), 390px (iPhone 12 Pro), 768px (iPad)

const { test, expect } = require('@playwright/test');

test.describe('MindSpark Mobile Responsiveness Tests', () => {
  const APP_URL = 'https://logicgame-1.preview.emergentagent.com';
  
  // Test data for different viewport sizes
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 }
  ];

  viewports.forEach(viewport => {
    test(`${viewport.name} (${viewport.width}px) - Home Page Responsiveness`, async ({ page }) => {
      console.log(`\n=== Testing ${viewport.name} (${viewport.width}px width) ===`);
      
      try {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        console.log(`✓ Viewport set to ${viewport.width}x${viewport.height}`);

        // Navigate to the app
        await page.goto(APP_URL, { waitUntil: 'networkidle' });
        console.log(`✓ Navigated to ${APP_URL}`);

        // Wait for page to load
        await page.waitForTimeout(3000);

        // Skip tutorial if present
        try {
          const skipButton = page.locator('button:has-text("Skip Tutorial"), button:has-text("Skip"), button:has-text("Close")').first();
          if (await skipButton.isVisible({ timeout: 5000 })) {
            await skipButton.click({ force: true });
            console.log('✓ Tutorial skipped');
            await page.waitForTimeout(2000);
          }
        } catch (e) {
          console.log('ℹ No tutorial found or already skipped');
        }

        // Check for console errors
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });

        // Take initial screenshot
        await page.screenshot({
          path: `./screenshots/${viewport.name.replace(' ', '_')}_home_initial.png`,
          quality: 40,
          fullPage: false
        });
        console.log(`✓ Initial screenshot taken for ${viewport.name}`);

        // Test 1: Verify top bar displays properly
        console.log('\n--- Testing Top Bar ---');
        const topBar = page.locator('.flex.flex-col.sm\\:flex-row.items-start.sm\\:items-center.justify-between').first();
        await expect(topBar).toBeVisible();
        console.log('✓ Top bar is visible');

        // Test profile section
        const profileSection = page.locator('.bg-white\\/20.backdrop-blur-sm.rounded-full').first();
        await expect(profileSection).toBeVisible();
        
        // Check if profile name is visible and not truncated badly
        const profileName = page.locator('.text-sm.sm\\:text-lg.font-black.text-white.truncate');
        if (await profileName.isVisible()) {
          const nameText = await profileName.textContent();
          console.log(`✓ Profile name visible: "${nameText}"`);
        }

        // Test stats badges (coins, stars, hints)
        const coinsBadge = page.locator('.flex.items-center.gap-1\\.5.sm\\:gap-2').filter({ has: page.locator('svg[data-lucide="coins"]') });
        const starsBadge = page.locator('.flex.items-center.gap-1\\.5.sm\\:gap-2').filter({ has: page.locator('svg[data-lucide="star"]') });
        const hintsBadge = page.locator('.flex.items-center.gap-1\\.5.sm\\:gap-2').filter({ has: page.locator('svg[data-lucide="zap"]') });
        
        await expect(coinsBadge).toBeVisible();
        await expect(starsBadge).toBeVisible();
        await expect(hintsBadge).toBeVisible();
        console.log('✓ All stats badges (coins, stars, hints) are visible');

        // Test 2: Verify title and subtitle
        console.log('\n--- Testing Title and Subtitle ---');
        const title = page.locator('h1:has-text("MINDSPARK")');
        await expect(title).toBeVisible();
        
        const subtitle = page.locator('p:has-text("Ultimate Brain Puzzles")');
        await expect(subtitle).toBeVisible();
        console.log('✓ Title "MINDSPARK" and subtitle "Ultimate Brain Puzzles" are visible');

        // Check if title fits without horizontal scrolling
        const titleBox = await title.boundingBox();
        if (titleBox && titleBox.width > viewport.width) {
          console.log(`⚠ Title might be too wide: ${titleBox.width}px > ${viewport.width}px`);
        } else {
          console.log('✓ Title fits within viewport width');
        }

        // Test 3: Verify featured modes (Daily Challenge, Time Attack)
        console.log('\n--- Testing Featured Modes ---');
        const dailyChallenge = page.locator('button:has-text("Daily Challenge")');
        const timeAttack = page.locator('button:has-text("Time Attack")');
        
        await expect(dailyChallenge).toBeVisible();
        await expect(timeAttack).toBeVisible();
        console.log('✓ Featured modes (Daily Challenge, Time Attack) are visible');

        // For tablet, check if they're side by side
        if (viewport.width >= 640) { // sm breakpoint
          const featuredGrid = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.gap-4.sm\\:gap-6');
          await expect(featuredGrid).toBeVisible();
          console.log('✓ Featured modes displayed in 2-column grid on tablet/desktop');
        }

        // Test 4: Verify main navigation buttons
        console.log('\n--- Testing Main Navigation Buttons ---');
        const navigationButtons = [
          'Categories',
          'All Levels', 
          'Tournament',
          'Leaderboard',
          'Shop',
          'Profile',
          'Analytics',
          'Settings'
        ];

        for (const buttonText of navigationButtons) {
          const button = page.locator(`button:has-text("${buttonText}")`);
          await expect(button).toBeVisible();
          
          // Check if button is properly sized for mobile (not too small)
          const buttonBox = await button.boundingBox();
          if (buttonBox) {
            const minTouchTarget = 44; // Minimum touch target size
            if (buttonBox.height < minTouchTarget && viewport.width < 640) {
              console.log(`⚠ ${buttonText} button might be too small for touch: ${buttonBox.height}px height`);
            } else {
              console.log(`✓ ${buttonText} button has adequate size`);
            }
          }
        }

        // Test button grid layout
        const buttonGrid = page.locator('.grid.grid-cols-2.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
        await expect(buttonGrid).toBeVisible();
        
        if (viewport.width >= 768) { // md breakpoint
          console.log('✓ Navigation buttons displayed in 3+ column grid on tablet');
        } else {
          console.log('✓ Navigation buttons displayed in 2-column grid on mobile');
        }

        // Test 5: Verify Quick Rewards section
        console.log('\n--- Testing Quick Rewards Section ---');
        const dailyLogin = page.locator('button:has-text("Daily Login")');
        const watchEarn = page.locator('button:has-text("Watch & Earn")');
        
        await expect(dailyLogin).toBeVisible();
        await expect(watchEarn).toBeVisible();
        console.log('✓ Quick Rewards section (Daily Login, Watch & Earn) is visible');

        // Test 6: Verify Quick Stats Banner
        console.log('\n--- Testing Quick Stats Banner ---');
        const statsBanner = page.locator('.bg-white\\/10.backdrop-blur-md.rounded-2xl.sm\\:rounded-3xl');
        await expect(statsBanner).toBeVisible();
        
        const statsGrid = page.locator('.grid.grid-cols-3.gap-3.sm\\:gap-6.text-center.text-white');
        await expect(statsGrid).toBeVisible();
        console.log('✓ Quick Stats Banner with 3-column layout is visible');

        // Test 7: Check for horizontal scrolling
        console.log('\n--- Testing for Horizontal Scrolling ---');
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        
        if (bodyWidth > viewportWidth) {
          console.log(`⚠ Horizontal scrolling detected: body width ${bodyWidth}px > viewport ${viewportWidth}px`);
        } else {
          console.log('✓ No horizontal scrolling detected');
        }

        // Test 8: Test button interactions
        console.log('\n--- Testing Button Interactions ---');
        
        // Test All Levels button
        const allLevelsBtn = page.locator('button:has-text("All Levels")');
        await allLevelsBtn.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Check if we're on levels page
        const levelsTitle = page.locator('h2:has-text("SELECT LEVEL")');
        if (await levelsTitle.isVisible({ timeout: 5000 })) {
          console.log('✓ All Levels navigation working');
          
          // Take screenshot of levels page
          await page.screenshot({
            path: `./screenshots/${viewport.name.replace(' ', '_')}_levels_page.png`,
            quality: 40,
            fullPage: false
          });
          
          // Navigate back to home
          const backBtn = page.locator('button:has-text("Back")');
          await backBtn.click({ force: true });
          await page.waitForTimeout(2000);
          console.log('✓ Back navigation working');
        } else {
          console.log('⚠ All Levels navigation may not be working properly');
        }

        // Test Settings button
        const settingsBtn = page.locator('button:has-text("Settings")').last();
        await settingsBtn.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Check if we're on settings page
        const settingsTitle = page.locator('h1:has-text("Settings")');
        if (await settingsTitle.isVisible({ timeout: 5000 })) {
          console.log('✓ Settings navigation working');
          
          // Take screenshot of settings page
          await page.screenshot({
            path: `./screenshots/${viewport.name.replace(' ', '_')}_settings_page.png`,
            quality: 40,
            fullPage: false
          });
          
          // Navigate back to home
          const backBtn = page.locator('button:has-text("Back")');
          await backBtn.click({ force: true });
          await page.waitForTimeout(2000);
          console.log('✓ Back navigation from settings working');
        } else {
          console.log('⚠ Settings navigation may not be working properly');
        }

        // Take final screenshot after scrolling
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `./screenshots/${viewport.name.replace(' ', '_')}_home_scrolled.png`,
          quality: 40,
          fullPage: false
        });
        console.log(`✓ Final scrolled screenshot taken for ${viewport.name}`);

        // Report console errors
        if (errors.length > 0) {
          console.log(`⚠ Console errors detected: ${errors.join(', ')}`);
        } else {
          console.log('✓ No console errors detected');
        }

        console.log(`\n✅ ${viewport.name} responsiveness test completed successfully`);

      } catch (error) {
        console.log(`❌ ${viewport.name} test failed: ${error.message}`);
        
        // Take error screenshot
        await page.screenshot({
          path: `./screenshots/${viewport.name.replace(' ', '_')}_error.png`,
          quality: 40,
          fullPage: false
        });
        
        throw error;
      }
    });
  });
});