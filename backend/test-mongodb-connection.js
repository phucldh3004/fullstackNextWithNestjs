const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI_USER = process.env.MONGODB_URI_USER;

console.log('🔄 Đang kết nối tới MongoDB...');
console.log('📍 URI:', MONGODB_URI_USER.replace(/:[^:@]+@/, ':****@')); // Ẩn password

mongoose
  .connect(MONGODB_URI_USER)
  .then(() => {
    console.log('✅ KẾT NỐI MONGODB THÀNH CÔNG!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    console.log('📝 ReadyState:', mongoose.connection.readyState); // 1 = connected

    // Test tạo collection
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    console.log('\n📦 Collections hiện có:');
    collections.forEach((col) => console.log('  -', col.name));

    // Query collection user
    return mongoose.connection.db.collection('user').find().toArray();
  })
  .then((users) => {
    console.log('\n👥 DANH SÁCH USERS:');
    console.log('Tổng số:', users.length);
    console.log('\n📄 Chi tiết:');
    users.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log(user);
    });

    mongoose.connection.close();
    console.log('\n✅ Test hoàn tất!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ LỖI KẾT NỐI:', error.message);
    process.exit(1);
  });
