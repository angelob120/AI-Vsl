/**
 * Template Index - Exports all business website templates
 */

import TemplateGeneral from './TemplateGeneral';
import TemplateHealth from './TemplateHealth';
import TemplateBeauty from './TemplateBeauty';
import TemplateProfessional from './TemplateProfessional';

// Template configuration with metadata
export const templates = [
  {
    id: 'general',
    name: 'Contractor',
    icon: '🔧',
    description: 'For contractors & home services',
    component: TemplateGeneral,
    defaultServices: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: '🏥',
    description: 'For healthcare & wellness',
    component: TemplateHealth,
    defaultServices: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  },
  {
    id: 'beauty',
    name: 'Beauty & Salon',
    icon: '💇',
    description: 'For salons & personal care',
    component: TemplateBeauty,
    defaultServices: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: '💼',
    description: 'For consultants & business services',
    component: TemplateProfessional,
    defaultServices: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  }
];

// Get template by ID
export const getTemplateById = (id) => {
  return templates.find(t => t.id === id) || templates[0];
};

// Export individual templates
export { TemplateGeneral, TemplateHealth, TemplateBeauty, TemplateProfessional };

export default templates;