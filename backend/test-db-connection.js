// Load environment variables
require('dotenv').config();

async function testConnection() {
  console.log('🧪 Testing Supabase Database Connection...\n');
  console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('🔗 Connection string preview:', process.env.DATABASE_URL ?
    process.env.DATABASE_URL.replace(/:[^:]+@/, ':***@') : 'N/A');
  console.log('');

  let prisma;
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  } catch (error) {
    console.error('❌ Failed to import PrismaClient:', error.message);
    return;
  }

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to Supabase database!\n');

    // Test query - count tables
    const userCount = await prisma.user.count();
    const customerCount = await prisma.customer.count();
    const leadCount = await prisma.lead.count();
    const campaignCount = await prisma.campaign.count();

    console.log('📊 Database Status:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🏢 Customers: ${customerCount}`);
    console.log(`   🎯 Leads: ${leadCount}`);
    console.log(`   📢 Campaigns: ${campaignCount}\n`);

    // Test create a sample user (if no users exist)
    if (userCount === 0) {
      console.log('📝 Creating sample admin user...');
      const sampleUser = await prisma.user.create({
        data: {
          name: 'System Admin',
          email: 'admin@crm.com',
          password: '$2b$10$hashedpassword', // This is just for testing
          role: 'ADMIN',
        },
      });
      console.log('✅ Sample user created:', sampleUser.email);
    }

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('🚀 You can now run: npm run start:dev');

  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check DATABASE_URL format in .env');
    console.log('2. Ensure Supabase project is not paused');
    console.log('3. Verify IP whitelist in Supabase settings');
    console.log('4. Try using Direct connection URL');
    console.log('5. Check if port 6543 is correct (should be 5432)');

    // Suggest URL format
    console.log('\n📝 Correct URL format:');
    console.log('postgresql://postgres.[ref]:[pass]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true');

  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the test
testConnection();