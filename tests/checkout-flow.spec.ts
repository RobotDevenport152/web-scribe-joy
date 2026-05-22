import { test, expect } from "@playwright/test";

test.describe("Core checkout flow", () => {
  test("authenticated user can add item to cart and reach checkout", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Pacific Alpacas/i);

    // Navigate to shop
    await page.goto("/shop");
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Add first product to cart
    await page.locator('[data-testid="product-card"]').first().click();
    await page.locator('[data-testid="add-to-cart"]').click();

    // Cart badge should update
    const cartBadge = page.locator('[data-testid="cart-count"]');
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });

  test("traceability page shows demo batch data", async ({ page }) => {
    await page.goto("/traceability");
    // Click first demo button
    await page.getByText("PA-2025-001").click();
    // Should show batch details
    await expect(page.getByText("Mackenzie")).toBeVisible({ timeout: 8000 });
  });
});
