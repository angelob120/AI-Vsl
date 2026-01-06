const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contractor_websites (
        id VARCHAR(255) PRIMARY KEY,
        form_data JSONB NOT NULL,
        images JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        link TEXT NOT NULL
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDatabase();

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Also support /health for backwards compatibility
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Save website
app.post('/api/websites', async (req, res) => {
  try {
    const { id, formData, images, link } = req.body;

    if (!id || !formData || !images || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO contractor_websites (id, form_data, images, link, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        form_data = $2,
        images = $3,
        link = $4
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      JSON.stringify(formData),
      JSON.stringify(images),
      link
    ]);

    res.json({
      success: true,
      website: {
        id: result.rows[0].id,
        formData: result.rows[0].form_data,
        images: result.rows[0].images,
        createdAt: result.rows[0].created_at,
        link: result.rows[0].link
      }
    });
  } catch (error) {
    console.error('Save website error:', error);
    res.status(500).json({ error: 'Failed to save website', details: error.message });
  }
});

// Get all websites
app.get('/api/websites', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contractor_websites ORDER BY created_at DESC'
    );

    const websites = result.rows.map(row => ({
      id: row.id,
      formData: row.form_data,
      images: row.images,
      createdAt: row.created_at,
      link: row.link
    }));

    res.json({ success: true, websites });
  } catch (error) {
    console.error('Get websites error:', error);
    res.status(500).json({ error: 'Failed to fetch websites', details: error.message });
  }
});

// Get single website by ID
app.get('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM contractor_websites WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      website: {
        id: row.id,
        formData: row.form_data,
        images: row.images,
        createdAt: row.created_at,
        link: row.link
      }
    });
  } catch (error) {
    console.error('Get website error:', error);
    res.status(500).json({ error: 'Failed to fetch website', details: error.message });
  }
});

// Delete website
app.delete('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM contractor_websites WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json({ success: true, message: 'Website deleted' });
  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ error: 'Failed to delete website', details: error.message });
  }
});

// ==================== SERVE REACT APP ====================

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// For any other request, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at /api/websites`);
});