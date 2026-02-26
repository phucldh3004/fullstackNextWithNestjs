const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:3001/customers', {}, { headers: { Authorization: 'Bearer INVALID_TOKEN' } });
    console.log(res.status);
  } catch (e) {
    console.log("Status:", e.response?.status);
    console.log("Data:", e.response?.data);
  }
})();
