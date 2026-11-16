const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

async function testApi() {
  let token = '';
  
  try {
    const instructor = await prisma.user.findFirst({ where: { role: 'instructor' } });
    if (!instructor) {
      console.log('No instructor found');
      return;
    }
    
    const jwt = require('jsonwebtoken');
    token = jwt.sign(
      { id: instructor.id, email: instructor.email, role: instructor.role, tenantId: instructor.tenantId },
      process.env.SECRET_ACCESS_TOKEN || 'supersecret_jwt_key_123',
      { expiresIn: '1d' }
    );
    console.log('Token created manually using SECRET_ACCESS_TOKEN');

  } catch(e) {
    console.error("Setup error:", e);
    return;
  } finally {
    await prisma.$disconnect();
  }

  try {
    console.log('Testing /api/live ...');
    const liveRes = await axios.get('http://localhost:5000/api/live', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('/api/live success! Data length:', liveRes.data?.data?.length);
  } catch (err) {
    if (err.response) {
      console.error('/api/live failed with status', err.response.status);
      console.error('Response data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }

  try {
    console.log('\nTesting /api/courses ...');
    const coursesRes = await axios.get('http://localhost:5000/api/courses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('/api/courses success! Data length:', coursesRes.data?.data?.length);
  } catch (err) {
    if (err.response) {
      console.error('/api/courses failed with status', err.response.status);
      console.error('Response data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testApi();
