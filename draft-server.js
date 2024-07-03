const express = require('express');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/showAll', async (req, res) => {
  try {
    const dataString = await fs.readFile('data.json', 'utf8');
    const jsonData = JSON.parse(dataString);
    res.json(jsonData.dailyData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/append', async (req, res) => {
  const data = req.body;
  if (!data || !data.date) return res.status(400).json({ success: false, message: "Data with date is required" });

  try {
    let jsonData = JSON.parse(await fs.readFile('data.json', 'utf8'));
    jsonData.dailyData.push(data);
    await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8');
    res.json({ success: true, message: "Data appended successfully", data: jsonData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add routes for other actions ('overwrite', 'delete', etc.) similarly

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});