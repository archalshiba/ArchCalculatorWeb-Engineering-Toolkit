import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Book, Globe, Settings } from 'lucide-react';
import { 
  ALL_STANDARDS, 
  checkMultiStandardCompliance, 
  getRecommendedStandards,
  REGIONAL_PREFERENCES,
  EngineeringStandard 
} from '../utils/engineeringStandards';

interface StandardsCompliancePanelProps {
  designParameters: {
    reinforcementRatio: number;
    minimumDimension: number;
    clearCover: number;
    numberOfBars: number;
  };
  region?: string;
  onStandardChange?: (standards: string[]) => void;
}

interface ComplianceResult {
  standardId: string;
  standardName: string;
  checks: Array<{
    clause: string;
    parameter: string;
    isCompliant: boolean;
    message: string;
  }>;
  overallCompliant: boolean;
}

export const StandardsCompliancePanel: React.FC<StandardsCompliancePanelProps> = ({
  designParameters,
  region = 'India',
  onStandardChange
}) => {
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([]);
  const [showStandardSelector, setShowStandardSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(region);

  useEffect(() => {
    const recommended = getRecommendedStandards(selectedRegion);
    setSelectedStandards(recommended);
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedStandards.length > 0) {
      const checks = [
        {
          clause: '26.5.3.1', // IS 456 clause for reinforcement
          parameter: 'minimum_reinforcement_ratio',
          value: designParameters.reinforcementRatio
        },
        {
          clause: '26.5.3.1',
          parameter: 'maximum_reinforcement_ratio',
          value: designParameters.reinforcementRatio
        },
        {
          clause: '26.5.1.1', // IS 456 clause for minimum dimensions
          parameter: 'minimum_dimension',
          value: designParameters.minimumDimension
        },
        {
          clause: 'Table 16', // IS 456 cover requirements
          parameter: 'moderate_exposure',
          value: designParameters.clearCover
        },
        {
          clause: '26.5.3.1',
          parameter: 'minimum_bars',
          value: designParameters.numberOfBars
        }
      ];

      const results = checkMultiStandardCompliance(selectedStandards, checks);
      setComplianceResults(results);
      
      if (onStandardChange) {
        onStandardChange(selectedStandards);
      }
    }
  }, [selectedStandards, designParameters, onStandardChange]);

  const handleStandardToggle = (standardId: string) => {
    setSelectedStandards(prev => 
      prev.includes(standardId)
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const getOverallComplianceStatus = () => {
    if (complianceResults.length === 0) return 'unknown';
    if (complianceResults.every(result => result.overallCompliant)) return 'compliant';
    if (complianceResults.some(result => result.overallCompliant)) return 'partial';
    return 'non-compliant';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'partial':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'non-compliant':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Shield className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Fully Compliant';
      case 'partial':
        return 'Partially Compliant';
      case 'non-compliant':
        return 'Non-Compliant';
      default:
        return 'Unknown';
    }
  };

  const overallStatus = getOverallComplianceStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Shield size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Standards Compliance
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(overallStatus)}
          <span className={`text-sm font-medium ${
            overallStatus === 'compliant' ? 'text-green-700 dark:text-green-300' :
            overallStatus === 'partial' ? 'text-yellow-700 dark:text-yellow-300' :
            overallStatus === 'non-compliant' ? 'text-red-700 dark:text-red-300' :
            'text-gray-700 dark:text-gray-300'
          }`}>
            {getStatusText(overallStatus)}
          </span>
          <button
            onClick={() => setShowStandardSelector(!showStandardSelector)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Configure Standards"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Standards Selector */}
      {showStandardSelector && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region/Country
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {Object.keys(REGIONAL_PREFERENCES).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Engineering Standards
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ALL_STANDARDS.map(standard => (
                <label key={standard.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStandards.includes(standard.id)}
                    onChange={() => handleStandardToggle(standard.id)}
                    className="mr-2 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {standard.name}
                    </span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {standard.fullName} ({standard.country}, {standard.year})
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Results */}
      <div className="p-4">
        {complianceResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Shield size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select engineering standards to check compliance</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complianceResults.map((result, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* Standard Header */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
                  <div className="flex items-center">
                    <Book size={16} className="text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {result.standardName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(result.overallCompliant ? 'compliant' : 'non-compliant')}
                    <span className={`ml-2 text-sm font-medium ${
                      result.overallCompliant 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.overallCompliant ? 'Compliant' : 'Non-Compliant'}
                    </span>
                  </div>
                </div>

                {/* Compliance Checks */}
                <div className="p-3">
                  <div className="space-y-2">
                    {result.checks.map((check, checkIndex) => (
                      <div key={checkIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {check.isCompliant ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {check.parameter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className={`text-xs ${
                            check.isCompliant 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {check.message}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Clause: {check.clause}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {complianceResults.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Checked against {complianceResults.length} standard(s)
            </div>
            <div className="flex items-center">
              <Globe size={14} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Region: {selectedRegion}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};