import React from 'react';
import { IndustrySector, CompanySize } from '../../types';

interface CompanyFormProps {
  formState: any;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ formState }) => {
  const { state, setCompany } = formState;
  const { company, errors } = state;

  const sectors: Array<{ value: IndustrySector; label: string }> = [
    { value: 'manufacturing', label: 'Industrie manufacturière' },
    { value: 'services', label: 'Services' },
    { value: 'retail', label: 'Commerce de détail' },
    { value: 'construction', label: 'Construction et BTP' },
    { value: 'technology', label: 'Technologies de l\'information' },
    { value: 'healthcare', label: 'Santé et action sociale' },
    { value: 'education', label: 'Éducation et formation' },
    { value: 'finance', label: 'Finance et assurance' },
    { value: 'agriculture', label: 'Agriculture et agroalimentaire' },
    { value: 'transport', label: 'Transport et logistique' },
    { value: 'energy', label: 'Énergie et utilities' },
    { value: 'other', label: 'Autre secteur' },
  ];

  const sizes: Array<{ value: CompanySize; label: string; description: string }> = [
    { value: 'small', label: 'Petite entreprise', description: '1-49 employés' },
    { value: 'medium', label: 'Moyenne entreprise', description: '50-249 employés' },
    { value: 'large', label: 'Grande entreprise', description: '250-999 employés' },
    { value: 'enterprise', label: 'Très grande entreprise', description: '1000+ employés' },
  ];

  const handleChange = (field: string, value: any) => {
    setCompany({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div>
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom de l'entreprise *
        </label>
        <input
          id="company-name"
          type="text"
          value={company.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Saisissez le nom de votre entreprise"
          className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Sector Selection */}
      <div>
        <label htmlFor="company-sector" className="block text-sm font-medium text-gray-700 mb-2">
          Secteur d'activité *
        </label>
        <select
          id="company-sector"
          value={company.sector || ''}
          onChange={(e) => handleChange('sector', e.target.value as IndustrySector)}
          className={`input-field ${errors.sector ? 'border-red-300 focus:ring-red-500' : ''}`}
        >
          <option value="">Sélectionnez votre secteur d'activité</option>
          {sectors.map((sector) => (
            <option key={sector.value} value={sector.value}>
              {sector.label}
            </option>
          ))}
        </select>
        {errors.sector && (
          <p className="mt-1 text-sm text-red-600">{errors.sector}</p>
        )}
      </div>

      {/* Company Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Taille de l'entreprise *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sizes.map((size) => (
            <label
              key={size.value}
              className={`
                relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
                ${company.size === size.value
                  ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${errors.size ? 'border-red-300' : ''}
              `}
            >
              <input
                type="radio"
                name="company-size"
                value={size.value}
                checked={company.size === size.value}
                onChange={(e) => handleChange('size', e.target.value as CompanySize)}
                className="sr-only"
              />
              <div className="flex flex-1">
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900">
                    {size.label}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {size.description}
                  </span>
                </div>
              </div>
              {company.size === size.value && (
                <div className="absolute top-2 right-2">
                  <div className="h-4 w-4 rounded-full bg-primary-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </div>
              )}
            </label>
          ))}
        </div>
        {errors.size && (
          <p className="mt-1 text-sm text-red-600">{errors.size}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="company-location" className="block text-sm font-medium text-gray-700 mb-2">
          Localisation *
        </label>
        <input
          id="company-location"
          type="text"
          value={company.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Ville, région ou pays"
          className={`input-field ${errors.location ? 'border-red-300 focus:ring-red-500' : ''}`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Cette information nous aide à appliquer les facteurs d'émission appropriés
        </p>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          📋 Informations importantes
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les questions suivantes seront adaptées à votre secteur d'activité</li>
          <li>• Toutes vos données restent confidentielles et ne sont pas partagées</li>
          <li>• Vous pourrez modifier ces informations plus tard si nécessaire</li>
        </ul>
      </div>
    </div>
  );
};
