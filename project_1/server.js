const express = require('express');
const Bytez = require('bytez.js');
const path = require('path');
const app = express();

const API_KEY = "1fd43e8593a407cf7db04a1a0820fb45";
const sdk = new Bytez(API_KEY);
const model = sdk.model("Qwen/Qwen3-4B-Instruct-2507");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'الرجاء إدخال رسالة' });
    }

    const { error, output } = await model.run([
      {
        "role": "user",
        "content": userMessage
      }
    ]);

    if (error) {
      return res.status(500).json({ error: 'حدث خطأ في النموذج' });
    }

    console.log('نوع output:', typeof output);
    console.log('output:', output);
    
    let responseText = '';

if (typeof output === 'string') {
  responseText = output;
} 
else if (Array.isArray(output)) {
  
  responseText = output[0]?.content || '';
}
else if (typeof output === 'object') {
  responseText = output.content || '';
}

res.json({ response: responseText });

    
  } catch (err) {
    console.error('خطأ:', err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

const PORT = process.env.PORT || 4320;
app.listen(PORT, () => {
  console.log(`port work in http://localhost:${PORT}`);
});
