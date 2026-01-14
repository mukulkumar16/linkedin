import { Server } from "socket.io";

const io = new Server(3001, {
  cors: { origin: "*" },
});

console.log("🚀 Socket server started on port 3001");

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // 🔑 Join personal user room
  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined personal room: ${userId}`);
  });

  // 💬 Join conversation room
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`💬 Joined conversation: ${conversationId}`);
  });

  // 📩 Send message
  socket.on("send-message", ({ conversationId, senderId, receiverId, text }) => {
    console.log("📨 Message:", text);

    // 1️⃣ Send message to open chat
    socket.to(conversationId).emit("receive-message", {
      conversationId,
      text,
      senderId,
    });

    // 2️⃣ Send notification to receiver (if chat not open)
    socket.to(receiverId).emit("new-notification", {
      conversationId,
      text,
      senderId,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
