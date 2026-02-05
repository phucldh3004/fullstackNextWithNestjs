import { test, expect } from '@playwright/test';

test('User Lock/Unlock E2E with Network Interception', async ({ page, request }) => {
  // 1. Go to Login Page
  await page.goto('http://localhost:3000/login');

  // 2. Perform Login (Adjust credentials as needed)
  await page.fill('input[type="text"]', 'admin'); // or valid username
  await page.fill('input[type="password"]', '123456'); // or valid password
  await page.click('button[type="submit"]');

  // 3. Wait for navigation to Dashboard
  await page.waitForURL('http://localhost:3000/');
  
  // 4. Navigate to Users Dashboard
  await page.goto('http://localhost:3000/dashboard/users');
  await page.waitForSelector('h1:has-text("Quản lý người dùng")');

  // 5. Intercept Network Requests to verify API call
  // We want to ensure that clicking the button actually triggers a request to the correct BE/API endpoint
  const apiRequestPromise = page.waitForRequest(req => 
    req.url().includes('/api/users') && 
    (req.url().includes('/lock') || req.url().includes('/unlock')) &&
    req.method() === 'PATCH'
  );

  // 6. Find a lock/unlock button
  // Note: This matches the FIRST button it finds. 
  // You might want to target a specific user if the table has many rows.
  // The button has an icon, so we look for the button inside the actions cell.
  
  // Assuming the lock/unlock button is the second or third in the action column.
  // Using a broader selector to find "any" lock/unlock button.
  // The icon logic is: <LockIcon /> (locked) or <LockOpenIcon /> (active/unlocked)
  // We can look for the button element.
  const toggleButton = page.locator('table tbody tr').first().locator('button').nth(1); 
  
  // Click the button
  await toggleButton.click();

  // 7. Verify the API call was made
  const interceptedRequest = await apiRequestPromise;
  console.log('✅ API Request Intercepted:', interceptedRequest.url());
  console.log('✅ Request Headers:', interceptedRequest.headers());

  expect(interceptedRequest.url()).toMatch(/\/api\/users\/[a-zA-Z0-9_-]+\/(lock|unlock)/);

  // 8. Wait for API response
  const response = await interceptedRequest.response();
  const status = response?.status();
  console.log('✅ API Response Status:', status);
  
  expect(status).toBe(200);

  // 9. Verify UI Toast/Snackbar
  // Expect "thành công"
  await expect(page.locator('.MuiAlert-message')).toContainText('thành công');
});
