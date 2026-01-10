/**
 * Template Index - Exports all contractor website templates
 */

import TemplateGeneral from './TemplateGeneral';

// Template configuration with metadata
export const templates = [
  {
    id: 'general',
    name: 'Professional',
    icon: '🏢',
    description: 'Universal contractor template',
    component: TemplateGeneral,
    defaultServices: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  }
];

// Get template by ID
export const getTemplateById = (id) => {
  return templates.find(t => t.id === id) || templates[0];
};

// Export individual templates
export {
  TemplateGeneral
};

export default templates;