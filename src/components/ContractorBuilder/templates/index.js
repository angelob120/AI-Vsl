/**
 * Template Index - Exports all contractor website templates
 */

import TemplatePlumbing from './TemplatePlumbing';
import TemplateLandscaping from './TemplateLandscaping';

// Template configuration with metadata
export const templates = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔧',
    description: 'Tailored for plumbing professionals',
    component: TemplatePlumbing,
    defaultServices: ['Drain Cleaning', 'Pipe Repair', 'Water Heaters', 'Leak Detection']
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: '🌿',
    description: 'Great for landscaping and lawn care',
    component: TemplateLandscaping,
    defaultServices: ['Lawn Care', 'Garden Design', 'Tree Service', 'Hardscaping']
  }
];

// Get template by ID
export const getTemplateById = (id) => {
  return templates.find(t => t.id === id) || templates[0];
};

// Export individual templates
export {
  TemplatePlumbing,
  TemplateLandscaping
};

export default templates;