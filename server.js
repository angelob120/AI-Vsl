const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
const initDatabase = async () => {
  try {
    // Create contractor_websites table (ACTIVE/WORKING websites - cleared after CSV download)
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

    // ARCHIVED WEBSITES TABLE - Permanent history, no deletion
    await pool.query(`
      CREATE TABLE IF NOT EXISTS archived_websites (
        id VARCHAR(255) PRIMARY KEY,
        form_data JSONB NOT NULL,
        images JSONB NOT NULL,
        template VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        link TEXT NOT NULL,
        batch_id VARCHAR(255) NOT NULL,
        archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // CSV EXPORTS TABLE - Export history with full data for re-download, no deletion
    await pool.query(`
      CREATE TABLE IF NOT EXISTS csv_exports (
        id VARCHAR(255) PRIMARY KEY,
        batch_id VARCHAR(255) NOT NULL UNIQUE,
        website_count INTEGER NOT NULL,
        websites_data JSONB NOT NULL,
        exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create webhook_leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS webhook_leads (
        id VARCHAR(255) PRIMARY KEY,
        company_name VARCHAR(500),
        owner_name VARCHAR(500),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        phone VARCHAR(100),
        email VARCHAR(255),
        address VARCHAR(500),
        city VARCHAR(255),
        state VARCHAR(100),
        postal_code VARCHAR(50),
        country VARCHAR(100),
        website VARCHAR(500),
        tagline TEXT,
        years_experience VARCHAR(50),
        services JSONB,
        raw_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database initialized with archive tables');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDatabase();

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== WEBHOOK LEADS ROUTES ====================

app.post('/api/webhook/ghl', async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || data.contact_id || data.contactId || 
               Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    
    const lead = {
      id,
      company_name: data.companyName || data.company_name || data.company || data.businessName || data.business_name || null,
      owner_name: data.ownerName || data.owner_name || data.owner || null,
      first_name: data.firstName || data.first_name || data.name?.split(' ')[0] || null,
      last_name: data.lastName || data.last_name || data.name?.split(' ').slice(1).join(' ') || null,
      phone: data.phone || data.phoneNumber || data.phone_number || data.mobile || null,
      email: data.email || data.emailAddress || data.email_address || null,
      address: data.address || data.address1 || data.streetAddress || data.street_address || null,
      city: data.city || null,
      state: data.state || data.region || null,
      postal_code: data.postalCode || data.postal_code || data.zip || data.zipCode || null,
      country: data.country || null,
      website: data.website || data.websiteUrl || data.website_url || data.url || null,
      tagline: data.tagline || data.slogan || null,
      years_experience: data.yearsExperience || data.years_experience || data.experience || null,
      services: data.services || null,
      raw_data: data
    };

    const query = `
      INSERT INTO webhook_leads (id, company_name, owner_name, first_name, last_name, phone, email,
        address, city, state, postal_code, country, website, tagline, years_experience, services, raw_data, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        company_name = COALESCE($2, webhook_leads.company_name),
        owner_name = COALESCE($3, webhook_leads.owner_name),
        first_name = COALESCE($4, webhook_leads.first_name),
        last_name = COALESCE($5, webhook_leads.last_name),
        phone = COALESCE($6, webhook_leads.phone),
        email = COALESCE($7, webhook_leads.email),
        address = COALESCE($8, webhook_leads.address),
        city = COALESCE($9, webhook_leads.city),
        state = COALESCE($10, webhook_leads.state),
        postal_code = COALESCE($11, webhook_leads.postal_code),
        country = COALESCE($12, webhook_leads.country),
        website = COALESCE($13, webhook_leads.website),
        tagline = COALESCE($14, webhook_leads.tagline),
        years_experience = COALESCE($15, webhook_leads.years_experience),
        services = COALESCE($16, webhook_leads.services),
        raw_data = $17
      RETURNING *
    `;

    const result = await pool.query(query, [
      lead.id, lead.company_name, lead.owner_name, lead.first_name, lead.last_name,
      lead.phone, lead.email, lead.address, lead.city, lead.state, lead.postal_code,
      lead.country, lead.website, lead.tagline, lead.years_experience,
      lead.services ? JSON.stringify(lead.services) : null, JSON.stringify(lead.raw_data)
    ]);

    console.log(`✅ Webhook lead received: ${lead.company_name || lead.first_name || lead.id}`);
    res.json({ success: true, message: 'Lead received successfully', lead: result.rows[0] });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook', details: error.message });
  }
});

app.get('/api/webhook/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM webhook_leads ORDER BY created_at DESC');
    const leads = result.rows.map(row => ({
      id: row.id, companyName: row.company_name, ownerName: row.owner_name,
      firstName: row.first_name, lastName: row.last_name, phone: row.phone,
      email: row.email, address: row.address, city: row.city, state: row.state,
      postalCode: row.postal_code, country: row.country, website: row.website,
      tagline: row.tagline, yearsExperience: row.years_experience,
      services: row.services, rawData: row.raw_data, createdAt: row.created_at
    }));
    res.json({ success: true, leads });
  } catch (error) {
    console.error('❌ Get webhook leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads', details: error.message });
  }
});

app.get('/api/webhook/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM webhook_leads WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    const row = result.rows[0];
    res.json({
      success: true,
      lead: {
        id: row.id, companyName: row.company_name, ownerName: row.owner_name,
        firstName: row.first_name, lastName: row.last_name, phone: row.phone,
        email: row.email, address: row.address, city: row.city, state: row.state,
        postalCode: row.postal_code, country: row.country, website: row.website,
        tagline: row.tagline, yearsExperience: row.years_experience,
        services: row.services, rawData: row.raw_data, createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('❌ Get webhook lead error:', error);
    res.status(500).json({ error: 'Failed to fetch lead', details: error.message });
  }
});

app.delete('/api/webhook/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM webhook_leads WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('❌ Delete webhook lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead', details: error.message });
  }
});

app.delete('/api/webhook/leads', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM webhook_leads RETURNING id');
    res.json({ success: true, message: `Deleted ${result.rowCount} leads`, deletedCount: result.rowCount });
  } catch (error) {
    console.error('❌ Delete all webhook leads error:', error);
    res.status(500).json({ error: 'Failed to delete leads', details: error.message });
  }
});

// ==================== WEBSITE ROUTES (Active Workspace) ====================

app.post('/api/websites', async (req, res) => {
  try {
    const { id, formData, images, template, link } = req.body;
    if (!id || !formData || !images || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const websiteTemplate = template || 'general';
    const query = `
      INSERT INTO contractor_websites (id, form_data, images, template, link, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET form_data = $2, images = $3, template = $4, link = $5
      RETURNING *
    `;
    const result = await pool.query(query, [id, JSON.stringify(formData), JSON.stringify(images), websiteTemplate, link]);
    res.json({
      success: true,
      website: {
        id: result.rows[0].id, formData: result.rows[0].form_data,
        images: result.rows[0].images, template: result.rows[0].template || 'general',
        createdAt: result.rows[0].created_at, link: result.rows[0].link
      }
    });
  } catch (error) {
    console.error('❌ Save website error:', error);
    res.status(500).json({ error: 'Failed to save website', details: error.message });
  }
});

app.get('/api/websites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contractor_websites ORDER BY created_at DESC');
    const websites = result.rows.map(row => ({
      id: row.id, formData: row.form_data, images: row.images,
      template: row.template || 'general', createdAt: row.created_at, link: row.link
    }));
    res.json({ success: true, websites });
  } catch (error) {
    console.error('❌ Get websites error:', error);
    res.status(500).json({ error: 'Failed to fetch websites', details: error.message });
  }
});

app.get('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contractor_websites WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Website not found' });
    const row = result.rows[0];
    res.json({
      success: true,
      website: {
        id: row.id, formData: row.form_data, images: row.images,
        template: row.template || 'general', createdAt: row.created_at, link: row.link
      }
    });
  } catch (error) {
    console.error('❌ Get website error:', error);
    res.status(500).json({ error: 'Failed to fetch website', details: error.message });
  }
});

app.delete('/api/websites/all', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contractor_websites RETURNING id');
    res.json({ success: true, message: `Deleted ${result.rowCount} websites`, deletedCount: result.rowCount });
  } catch (error) {
    console.error('❌ Delete all websites error:', error);
    res.status(500).json({ error: 'Failed to delete websites', details: error.message });
  }
});

app.delete('/api/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM contractor_websites WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Website not found' });
    res.json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('❌ Delete website error:', error);
    res.status(500).json({ error: 'Failed to delete website', details: error.message });
  }
});

// ==================== ARCHIVE & EXPORT ROUTES ====================

// Archive websites and create CSV export record - called when downloading CSV
app.post('/api/archive/export', async (req, res) => {
  try {
    const { websites } = req.body;
    if (!websites || websites.length === 0) {
      return res.status(400).json({ error: 'No websites to archive' });
    }

    const batchId = 'batch_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const exportId = 'export_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert websites into archived_websites
      for (const site of websites) {
        await client.query(`
          INSERT INTO archived_websites (id, form_data, images, template, created_at, link, batch_id, archived_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE SET batch_id = $7, archived_at = CURRENT_TIMESTAMP
        `, [
          site.id, JSON.stringify(site.formData), JSON.stringify(site.images),
          site.template || 'general', site.createdAt || new Date().toISOString(),
          site.link, batchId
        ]);
      }

      // 2. Create CSV export record with full data
      await client.query(`
        INSERT INTO csv_exports (id, batch_id, website_count, websites_data, exported_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      `, [exportId, batchId, websites.length, JSON.stringify(websites)]);

      // 3. Clear contractor_websites (active workspace)
      await client.query('DELETE FROM contractor_websites');

      await client.query('COMMIT');
      console.log(`✅ Archived ${websites.length} websites with batch ID: ${batchId}`);

      res.json({
        success: true, batchId, exportId, archivedCount: websites.length,
        message: `Successfully archived ${websites.length} websites`
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Archive export error:', error);
    res.status(500).json({ error: 'Failed to archive websites', details: error.message });
  }
});

// Get all archived websites (with optional search and batch filter)
app.get('/api/archive/websites', async (req, res) => {
  try {
    const { search, batchId } = req.query;
    let query = 'SELECT * FROM archived_websites';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(
        form_data->>'companyName' ILIKE $${params.length + 1} OR 
        form_data->>'ownerName' ILIKE $${params.length + 1} OR
        form_data->>'email' ILIKE $${params.length + 1}
      )`);
      params.push(`%${search}%`);
    }

    if (batchId) {
      conditions.push(`batch_id = $${params.length + 1}`);
      params.push(batchId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY archived_at DESC';

    const result = await pool.query(query, params);
    const websites = result.rows.map(row => ({
      id: row.id, formData: row.form_data, images: row.images,
      template: row.template || 'general', createdAt: row.created_at,
      link: row.link, batchId: row.batch_id, archivedAt: row.archived_at
    }));

    res.json({ success: true, websites });
  } catch (error) {
    console.error('❌ Get archived websites error:', error);
    res.status(500).json({ error: 'Failed to fetch archived websites', details: error.message });
  }
});

// Get all CSV export history
app.get('/api/archive/exports', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, batch_id, website_count, exported_at FROM csv_exports ORDER BY exported_at DESC'
    );
    const exports = result.rows.map(row => ({
      id: row.id, batchId: row.batch_id,
      websiteCount: row.website_count, exportedAt: row.exported_at
    }));
    res.json({ success: true, exports });
  } catch (error) {
    console.error('❌ Get CSV exports error:', error);
    res.status(500).json({ error: 'Failed to fetch export history', details: error.message });
  }
});

// Get single CSV export by ID (includes full website data for re-download)
app.get('/api/archive/exports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM csv_exports WHERE id = $1 OR batch_id = $1', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Export not found' });

    const row = result.rows[0];
    res.json({
      success: true,
      export: {
        id: row.id, batchId: row.batch_id, websiteCount: row.website_count,
        websitesData: row.websites_data, exportedAt: row.exported_at
      }
    });
  } catch (error) {
    console.error('❌ Get CSV export error:', error);
    res.status(500).json({ error: 'Failed to fetch export', details: error.message });
  }
});

// Get archive statistics
app.get('/api/archive/stats', async (req, res) => {
  try {
    const websiteCountResult = await pool.query('SELECT COUNT(*) as count FROM archived_websites');
    const exportCountResult = await pool.query('SELECT COUNT(*) as count FROM csv_exports');
    const totalExportedResult = await pool.query('SELECT COALESCE(SUM(website_count), 0) as total FROM csv_exports');

    res.json({
      success: true,
      stats: {
        totalArchivedWebsites: parseInt(websiteCountResult.rows[0].count),
        totalExports: parseInt(exportCountResult.rows[0].count),
        totalWebsitesExported: parseInt(totalExportedResult.rows[0].total)
      }
    });
  } catch (error) {
    console.error('❌ Get archive stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

// Update an archived website (for edit functionality)
app.put('/api/archive/websites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { formData, images, template } = req.body;
    
    if (!formData || !images) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(`
      UPDATE archived_websites 
      SET form_data = $1, images = $2, template = $3
      WHERE id = $4
      RETURNING *
    `, [JSON.stringify(formData), JSON.stringify(images), template || 'general', id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archived website not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      website: {
        id: row.id, formData: row.form_data, images: row.images,
        template: row.template || 'general', createdAt: row.created_at,
        link: row.link, batchId: row.batch_id, archivedAt: row.archived_at
      }
    });
  } catch (error) {
    console.error('❌ Update archived website error:', error);
    res.status(500).json({ error: 'Failed to update website', details: error.message });
  }
});

// ==================== STATIC FILE SERVING ====================

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Archive API: /api/archive/*`);
  console.log(`🔗 Webhook endpoint: POST /api/webhook/ghl`);
});
