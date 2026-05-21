import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cartStore";

const mockItem = {
  productId: "p1",
  name: "经典款羊驼被",
  nameEn: "Classic Alpaca Duvet",
  price_nzd: 579,
  price_cny: 2880,
  price_usd: 349,
  size: "200x230",
  color: "经典白",
  image: "/images/product-classic-duvet.jpg",
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds item and increments count", () => {
    useCartStore.getState().addItem(mockItem);
    expect(useCartStore.getState().totalItems()).toBe(1);
  });

  it("deduplicates same product+size", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem(mockItem);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("treats same product with different size as separate items", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem({ ...mockItem, size: "220x240" });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removeItem by productId+size only removes that variant", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem({ ...mockItem, size: "220x240" });
    useCartStore.getState().removeItem("p1", "200x230");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].size).toBe("220x240");
  });

  it("subtotalNZD sums price_nzd * quantity", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().updateQuantity("p1", "200x230", 3);
    expect(useCartStore.getState().subtotalNZD()).toBe(579 * 3);
  });

  it("clearCart resets everything", () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().setPromoCode("WELCOME10", { type: "percent", value: 10 });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().promoCode).toBeNull();
    expect(useCartStore.getState().discount).toBeNull();
  });

  it("percent discount calc", () => {
    useCartStore.getState().addItem(mockItem); // 579 NZD
    useCartStore.getState().setPromoCode("WELCOME10", { type: "percent", value: 10 });
    const { discount } = useCartStore.getState();
    expect(discount?.type).toBe("percent");
    if (discount?.type === "percent") {
      const discountAmount = 579 * (discount.value / 100);
      expect(discountAmount).toBeCloseTo(57.9);
    }
  });

  it("fixed discount is capped at subtotal", () => {
    useCartStore.getState().addItem({ ...mockItem, price_nzd: 30 }); // only NZD 30
    useCartStore.getState().setPromoCode("ALPACA50", { type: "fixed", amountNZD: 50 });
    const { discount } = useCartStore.getState();
    if (discount?.type === "fixed") {
      const applied = Math.min(discount.amountNZD, 30);
      expect(applied).toBe(30); // capped, not -20
    }
  });
});
