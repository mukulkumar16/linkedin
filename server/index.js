import { Server } from "socket.io";

const io = new Server(3001, {
  cors: { origin: "*" },
});

console.log("🚀 Socket server started on port 3001");

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  /* ---------- JOIN USER ROOM ---------- */
  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined personal room: ${userId}`);
  });

  /* ---------- JOIN CONVERSATION ROOM ---------- */
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`💬 Joined conversation: ${conversationId}`);
  });

  /* ---------- SEND MESSAGE ---------- */
  socket.on(
    "send-message",
    ({ conversationId, senderId, receiverId, text }) => {
      const payload = {
        conversationId,
        text,
        senderId,
        createdAt: new Date().toISOString(), // 🔥 IMPORTANT
      };

      console.log("📨 Message:", payload);

      // 1️⃣ Send to OPEN conversation (ChatWindow)
      socket.to(conversationId).emit("receive-message", payload);

      // 2️⃣ Send notification to receiver (ChatList unread)
      socket.to(receiverId).emit("new-notification", payload);
    }
  );

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
