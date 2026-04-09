"use server";

import { createClient } from "@/lib/supabase/server";

export type OrderItem = {
  product_id: string;
  quantity:   number;
  unit_price: number;
  name:       string;
};

export type CreateOrderInput = {
  customer_name:    string;
  customer_phone:   string;
  customer_phone2?: string;
  wilaya_id:        number;
  commune:          string;
  address:          string;
  delivery_type:    "desk" | "home";
  delivery_fee:     number;
  notes?:           string;
  items:            OrderItem[];
};

export type CreateOrderResult =
  | { success: true;  orderNumber: string }
  | { success: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: false, error: "الخدمة غير متاحة حالياً" };
  }

  // Basic validation
  if (!input.customer_name?.trim())  return { success: false, error: "الاسم مطلوب" };
  if (!input.customer_phone?.trim()) return { success: false, error: "رقم الهاتف مطلوب" };
  if (!/^(05|06|07)\d{8}$/.test(input.customer_phone.replace(/\s/g, ""))) {
    return { success: false, error: "رقم الهاتف غير صحيح" };
  }
  if (!input.commune?.trim())  return { success: false, error: "البلدية مطلوبة" };
  if (!input.address?.trim())  return { success: false, error: "العنوان مطلوب" };
  if (!input.items?.length)    return { success: false, error: "السلة فارغة" };

  const subtotal = input.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const total    = subtotal + input.delivery_fee;

  try {
    const supabase = await createClient();

    // Insert order
    const orderResult = await ((supabase
      .from("orders") as any)
      .insert({
        customer_name:   input.customer_name.trim(),
        customer_phone:  input.customer_phone.replace(/\s/g, ""),
        customer_phone2: input.customer_phone2?.trim() || null,
        wilaya_id:       input.wilaya_id,
        commune:         input.commune.trim(),
        address:         input.address.trim(),
        delivery_type:   input.delivery_type,
        delivery_fee:    input.delivery_fee,
        subtotal,
        total,
        notes:           input.notes?.trim() || null,
        status:          "pending",
        payment_method:  "cod",
      })
      .select("id, order_number")
      .single() as unknown as Promise<{ data: { id: string; order_number: string } | null; error: unknown }>);
    const order = orderResult.data;
    const orderError = orderResult.error;

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return { success: false, error: "حدث خطأ أثناء إنشاء الطلب. حاول مجدداً." };
    }

    // Insert order items
    const orderItems = input.items.map((item) => ({
      order_id:   order.id,
      product_id: item.product_id,
      quantity:   item.quantity,
      unit_price: item.unit_price,
      name:       item.name,
    }));

    const { error: itemsError } = await (supabase.from("order_items") as any).insert(orderItems) as { error: { code?: string; message?: string } | null };

    if (itemsError) {
      // If it's a stock error (P0001), delete the order and return helpful message
      if (itemsError.code === "P0001" || itemsError.message?.includes("Insufficient stock")) {
        await (supabase.from("orders") as any).delete().eq("id", order.id);
        return { success: false, error: "أحد المنتجات نفذ من المخزون. يرجى مراجعة سلتك." };
      }
      console.error("Order items error:", itemsError);
      await (supabase.from("orders") as any).delete().eq("id", order.id);
      return { success: false, error: "حدث خطأ أثناء تسجيل المنتجات. حاول مجدداً." };
    }

    return { success: true, orderNumber: order.order_number };
  } catch (err) {
    console.error("Unexpected order error:", err);
    return { success: false, error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." };
  }
}
