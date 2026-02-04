const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");

/* ================= CREATE ORDER ================= */
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    console.log("📝 Creating order with data:", { orderItems, shippingAddress, paymentMethod, totalPrice });

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    const sanitizedItems = orderItems.map((item) => {
  if (!item.name || !item.price || !item.qty) {
    throw new Error("Invalid order item data");
  }

  return {
    name: item.name,
    image: item.image || null,
    qty: item.qty,
    price: item.price,
    product: item.product || item._id,
  };
});


    const order = new Order({
      user: req.user._id,
      orderItems: sanitizedItems,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("✅ Order created successfully:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Order creation error:", error.message || error);
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});

/* ================= USER ORDERS ================= */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "image name price")
    .sort({createdAt: -1 })
    .select("orderItems totalPrice isPaid orderStatus deliveredAt cancelledAt createdAt");
    
    // Ensure images are populated from product if not directly set
    const enrichedOrders = orders.map(order => {
      const plainOrder = order.toObject();
      plainOrder.orderItems = plainOrder.orderItems.map(item => {
        // Use direct image if it's valid, otherwise use product image
        const validImage = item.image && item.image !== "/placeholder.png" ? item.image : (item.product?.image || null);
        return {
          ...item,
          image: validImage
        };
      });
      return plainOrder;
    });
    
    res.json(enrichedOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ================= ADMIN: ALL ORDERS ================= */
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* ================= ADMIN: MARK DELIVERED ================= */
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled orders cannot be delivered" });
    }

    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ message: "Order already delivered" });
    }

    order.deliveredAt = Date.now();
    order.orderStatus = "Delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Delivery update failed" });
  }
});

/* ================= ADMIN: CANCEL ORDER ================= */
router.put("/:id/cancel", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ message: "Delivered orders cannot be cancelled" });
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Order already cancelled" });
    }

    order.cancelledAt = Date.now();
    order.orderStatus = "Cancelled";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
});

/* ================= ADMIN: RESTORE CANCELLED ORDER ================= */
router.put("/:id/restore", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "Cancelled") {
      return res
        .status(400)
        .json({ message: "Only cancelled orders can be restored" });
    }

    order.cancelledAt = null;
    order.orderStatus = "Placed";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Restore failed" });
  }
});

/* ================= ORDER DETAILS ================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to load order" });
  }
});

module.exports = router;
