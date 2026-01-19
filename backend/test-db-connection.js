/**
 * MongoDB Connection Test Script
 * 
 * Chạy script này để test connection trước khi deploy
 * Usage: node test-db-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Colors cho console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

async function testConnection(uri, dbName) {
  try {
    log.info(`Testing connection to: ${dbName}...`);
    
    // Hide password trong log
    const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    log.info(`URI: ${safeUri}`);
    
    // Connect với timeout
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    }).asPromise();
    
    log.success(`Connected to ${dbName}!`);
    
    // Test write operation
    const TestModel = conn.model('Test', new mongoose.Schema({
      message: String,
      timestamp: Date
    }));
    
    const testDoc = await TestModel.create({
      message: 'Connection test successful',
      timestamp: new Date()
    });
    
    log.success(`Write test successful! Document ID: ${testDoc._id}`);
    
    // Test read operation
    const readDoc = await TestModel.findById(testDoc._id);
    log.success(`Read test successful! Message: ${readDoc.message}`);
    
    // Cleanup
    await TestModel.deleteOne({ _id: testDoc._id });
    log.success('Cleanup successful!');
    
    // Close connection
    await conn.close();
    log.success(`${dbName} connection test completed!\n`);
    
    return true;
  } catch (error) {
    log.error(`Failed to connect to ${dbName}`);
    log.error(`Error: ${error.message}`);
    
    // Helpful error messages
    if (error.message.includes('Authentication failed')) {
      log.warn('Tip: Check username and password are correct');
    } else if (error.message.includes('connection timed out')) {
      log.warn('Tip: Check network access/IP whitelist in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      log.warn('Tip: Check MongoDB host URL is correct');
    }
    
    console.error('\nFull error:', error);
    return false;
  }
}

async function main() {
  console.log('\n==========================================');
  console.log('  MongoDB Connection Test');
  console.log('==========================================\n');
  
  const MONGODB_URI_USER = process.env.MONGODB_URI_USER;
  const MONGODB_URI_APP = process.env.MONGODB_URI_APP;
  
  // Check if environment variables are set
  if (!MONGODB_URI_USER && !MONGODB_URI_APP) {
    log.error('No MongoDB URIs found in environment variables!');
    log.info('Please set MONGODB_URI_USER and/or MONGODB_URI_APP in .env file');
    log.info('\nExample .env:');
    console.log('MONGODB_URI_USER=mongodb+srv://user:pass@cluster.mongodb.net/users_db');
    console.log('MONGODB_URI_APP=mongodb+srv://user:pass@cluster.mongodb.net/app_db');
    process.exit(1);
  }
  
  let allSuccess = true;
  
  // Test Users DB connection
  if (MONGODB_URI_USER) {
    log.info('=== Testing USERS Database ===\n');
    const userSuccess = await testConnection(MONGODB_URI_USER, 'Users DB');
    allSuccess = allSuccess && userSuccess;
  } else {
    log.warn('MONGODB_URI_USER not found, skipping...\n');
  }
  
  // Test App DB connection
  if (MONGODB_URI_APP) {
    log.info('=== Testing APP Database ===\n');
    const appSuccess = await testConnection(MONGODB_URI_APP, 'App DB');
    allSuccess = allSuccess && appSuccess;
  } else {
    log.warn('MONGODB_URI_APP not found, skipping...\n');
  }
  
  // Final result
  console.log('==========================================');
  if (allSuccess) {
    log.success('All database connections successful! 🎉');
    log.info('You can deploy to Render now!');
  } else {
    log.error('Some database connections failed! 😞');
    log.info('Please fix the issues above before deploying');
  }
  console.log('==========================================\n');
  
  process.exit(allSuccess ? 0 : 1);
}

// Run test
main().catch(error => {
  log.error('Unexpected error:');
  console.error(error);
  process.exit(1);
});

