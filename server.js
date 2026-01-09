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
    // Create contractor_websites table if not exists (with template column)
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

    // Create webhook_leads table for storing inbound GHL data
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

    // Create repliq_videos table for storing generated video landing pages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS repliq_videos (
        id VARCHAR(255) PRIMARY KEY,
        lead_data JSONB NOT NULL,
        settings JSONB NOT NULL,
        video_data TEXT,
        second_video_data TEXT,
        landing_page_html TEXT,
        video_only_html TEXT,
        landing_page_link TEXT,
        video_only_link TEXT,
        website_url TEXT,
        company_name VARCHAR(500),
        first_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully with template, webhook_leads, and repliq_videos support');
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

// ==================== VIDEO COMPOSITION ENDPOINT ====================

app.post('/api/repliq/compose-video', async (req, res) => {
  console.log('📹 Received compose-video request');
  
  try {
    const { 
      introVideoData,
      websiteUrl,
      displayMode,
      videoPosition,
      videoShape
    } = req.body;

    if (!introVideoData) {
      return res.status(400).json({ error: 'Missing introVideoData' });
    }

    console.log('🎬 Composing video for:', websiteUrl);
    console.log('⚙️ Settings:', { displayMode, videoPosition, videoShape });

    // Note: saveBase64ToFile, composeVideo, and fileToBase64DataUrl functions
    // need to be implemented or imported for this endpoint to work
    // For now, return a placeholder response
    res.status(501).json({ 
      error: 'Video composition not yet implemented',
      message: 'The video composer functions need to be added'
    });

  } catch (error) {
    console.error('❌ Video composition error:', error);
    res.status(500).json({ 
      error: 'Failed to compose video', 
      details: error.message 
    });
  }
});

// ==================== WEBHOOK LEADS ROUTES ====================

// Inbound webhook endpoint for GHL (GoHighLevel)
app.post('/api/webhook/ghl', async (req, res) => {
  try {
    const data = req.body;
    
    // Generate unique ID if not provided
    const id = data.id || data.contact_id || data.contactId || 
               Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    
    // Map GHL fields to our schema (handle various field name formats)
    const lead = {
      id,
      company_name: data.companyName || data.company_name || data.company || 
                    data.businessName || data.business_name || null,
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
      INSERT INTO webhook_leads (
        id, company_name, owner_name, first_name, last_name, phone, email,
        address, city, state, postal_code, country, website, tagline,
        years_experience, services, raw_data, created_at
      )
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
      lead.id,
      lead.company_name,
      lead.owner_name,
      lead.first_name,
      lead.last_name,
      lead.phone,
      lead.email,
      lead.address,
      lead.city,
      lead.state,
      lead.postal_code,
      lead.country,
      lead.website,
      lead.tagline,
      lead.years_experience,
      lead.services ? JSON.stringify(lead.services) : null,
      JSON.stringify(lead.raw_data)
    ]);

    console.log(`✅ Webhook lead received: ${lead.company_name || lead.first_name || lead.id}`);

    res.json({
      success: true,
      message: 'Lead received successfully',
      lead: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook', details: error.message });
  }
});

// Get all webhook leads
app.get('/api/webhook/leads', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM webhook_leads ORDER BY created_at DESC'
    );

    const leads = result.rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      ownerName: row.owner_name,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country,
      website: row.website,
      tagline: row.tagline,
      yearsExperience: row.years_experience,
      services: row.services,
      rawData: row.raw_data,
      createdAt: row.created_at
    }));

    res.json({ success: true, leads });
  } catch (error) {
    console.error('❌ Get webhook leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads', details: error.message });
  }
});

// Get single webhook lead by ID
app.get('/api/webhook/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM webhook_leads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      lead: {
        id: row.id,
        companyName: row.company_name,
        ownerName: row.owner_name,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        email: row.email,
        address: row.address,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
        website: row.website,
        tagline: row.tagline,
        yearsExperience: row.years_experience,
        services: row.services,
        rawData: row.raw_data,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('❌ Get webhook lead error:', error);
    res.status(500).json({ error: 'Failed to fetch lead', details: error.message });
  }
});

// Delete single webhook lead
app.delete('/api/webhook/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM webhook_leads WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('❌ Delete webhook lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead', details: error.message });
  }
});

// Delete ALL webhook leads
app.delete('/api/webhook/leads', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM webhook_leads RETURNING id');
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.rowCount} leads`,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error('❌ Delete all webhook leads error:', error);
    res.status(500).json({ error: 'Failed to delete leads', details: error.message });
  }
});

// ==================== WEBSITE ROUTES ====================

// Save website (with template support)
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
    console.error('❌ Save website error:', error);
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
    console.error('❌ Get websites error:', error);
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
    console.error('❌ Get website error:', error);
    res.status(500).json({ error: 'Failed to fetch website', details: error.message });
  }
});

// Delete ALL websites - MUST come BEFORE /:id route!
app.delete('/api/websites/all', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contractor_websites RETURNING id');
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.rowCount} websites`,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error('❌ Delete all websites error:', error);
    res.status(500).json({ error: 'Failed to delete websites', details: error.message });
  }
});

// Delete single website
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
    console.error('❌ Delete website error:', error);
    res.status(500).json({ error: 'Failed to delete website', details: error.message });
  }
});

// ==================== STATIC FILE SERVING ====================

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📹 Video composition endpoint: POST /api/repliq/compose-video`);
  console.log(`📊 RepliQ Videos API: /api/repliq/videos`);
  console.log(`🔗 Webhook endpoint: POST /api/webhook/ghl`);
});