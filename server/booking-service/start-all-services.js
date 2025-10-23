const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting all CheapTrip services...\n');

// Danh sách các services cần khởi động
const services = [
  {
    name: 'Booking Service (MoMo + ZaloPay)',
    command: 'npm',
    args: ['start'],
    cwd: path.join(__dirname)
  }
];

// Khởi động từng service
services.forEach(service => {
  console.log(`📦 Starting ${service.name}...`);
  
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error.message);
  });

  child.on('close', (code) => {
    console.log(`🔚 ${service.name} exited with code ${code}`);
  });
});

console.log('\n✅ All services started!');
console.log('\n📋 Available endpoints:');
console.log('   - MoMo Payment: POST http://localhost:3004/api/bookings/momo/create-order');
console.log('   - ZaloPay Payment: POST http://localhost:3004/api/bookings/zalopay/create-order');
console.log('   - MoMo Callback: POST http://localhost:3004/api/bookings/momo/callback');
console.log('   - ZaloPay Callback: POST http://localhost:3004/api/bookings/zalopay/callback');
console.log('\n🧪 Test MoMo service: node test-momo.js');
console.log('\n🌐 Frontend: http://localhost:8080'); 