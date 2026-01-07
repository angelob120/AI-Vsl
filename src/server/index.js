const express = require('express');
const cors = require('cors');
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

// Initialize database table with template column
const initDatabase = async () => {
  try {
    // Create table if not exists (with template column)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contractor_websites (
        id VARCHAR(255) PRIMARY KEY,
        form_data JSONB NOT NULL,
        images JSONB NOT NULL,
        template VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        link TEXT NOT NULL
      )
    `);
    
    // Add template column if it doesn't exist (for existing databases)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'contractor_websites' 
          AND column_name = 'template'
        ) THEN 
          ALTER TABLE contractor_websites ADD COLUMN template VARCHAR(50) DEFAULT 'general';
        END IF;
      END $$;
    `);
    
    console.log('Database initialized successfully with template support');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDatabase();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Save website (with template support)
app.post('/api/websites', async (req, res) => {
  try {
    const { id, formData, images, template, link } = req.body;

    if (!id || !formData || !images || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Default template to 'general' if not provided
    const websiteTemplate = template || 'general';

    const query = `
      INSERT INTO contractor_websites (id, form_data, images, template, link, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        form_data = $2,
        images = $3,
        template = $4,
        link = $5
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      JSON.stringify(formData),
      JSON.stringify(images),
      websiteTemplate,
      link
    ]);

    res.json({
      success: true,
      website: {
        id: result.rows[0].id,
        formData: result.rows[0].form_data,
        images: result.rows[0].images,
        template: result.rows[0].template || 'general',
        createdAt: result.rows[0].created_at,
        link: result.rows[0].link
      }
    });
  } catch (error) {
    console.error('Save website error:', error);
    res.status(500).json({ error: 'Failed to save website', details: error.message });
  }
});

// Get all websites (with template support)
app.get('/api/websites', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contractor_websites ORDER BY created_at DESC'
    );

    const websites = result.rows.map(row => ({
      id: row.id,
      formData: row.form_data,
      images: row.images,
      template: row.template || 'general',
      createdAt: row.created_at,
      link: row.link
    }));

    res.json({ success: true, websites });
  } catch (error) {
    console.error('Get websites error:', error);
    res.status(500).json({ error: 'Failed to fetch websites', details: error.message });
  }
});

// Get single website by ID (with template support)
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
        template: row.template || 'general',
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
      'DELETE FROM contractor_websites WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ error: 'Failed to delete website', details: error.message });
  }
});

// Delete ALL websites
app.delete('/api/websites', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contractor_websites RETURNING id');
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${result.rowCount} websites` 
    });
  } catch (error) {
    console.error('Delete all websites error:', error);
    res.status(500).json({ error: 'Failed to delete all websites', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supported templates: general, roofing, plumbing, electrical, hvac, landscaping`);
});