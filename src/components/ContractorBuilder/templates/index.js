/**
 * Template Index - Exports all contractor website templates
 */

import TemplateGeneral from './TemplateGeneral';
import TemplateRoofing from './TemplateRoofing';
import TemplatePlumbing from './TemplatePlumbing';
import TemplateElectrical from './TemplateElectrical';
import TemplateHVAC from './TemplateHVAC';
import TemplateLandscaping from './TemplateLandscaping';

// Template configuration with metadata
export const templates = [
  {
    id: 'general',
    name: 'General Contractor',
    icon: '🏗️',
    description: 'Perfect for general construction and home improvement',
    component: TemplateGeneral,
    defaultServices: ['Home Renovations', 'Room Additions', 'Kitchen Remodels', 'Bathroom Renovations']
  },
  {
    id: 'roofing',
    name: 'Roofing',
    icon: '🏠',
    description: 'Designed for roofing contractors',
    component: TemplateRoofing,
    defaultServices: ['Roof Installation', 'Roof Repair', 'Storm Damage', 'Inspections']
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🔧',
    description: 'Tailored for plumbing professionals',
    component: TemplatePlumbing,
    defaultServices: ['Drain Cleaning', 'Pipe Repair', 'Water Heaters', 'Leak Detection']
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    description: 'Built for electrical contractors',
    component: TemplateElectrical,
    defaultServices: ['Panel Upgrades', 'Rewiring', 'Lighting Installation', 'EV Charging']
  },
  {
    id: 'hvac',
    name: 'HVAC',
    icon: '❄️',
    description: 'Ideal for heating and cooling services',
    component: TemplateHVAC,
    defaultServices: ['AC Installation', 'Heating Repair', 'Duct Cleaning', 'Maintenance']
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
  TemplateGeneral,
  TemplateRoofing,
  TemplatePlumbing,
  TemplateElectrical,
  TemplateHVAC,
  TemplateLandscaping
};

export default templates;