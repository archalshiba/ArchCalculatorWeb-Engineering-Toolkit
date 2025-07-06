import React, { useState } from 'react';
import { FileText, Download, Eye, Settings, Printer, Share2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ReportData, ReportTemplate, REPORT_TEMPLATES, generateHTMLReport, downloadReport } from '../utils/reportGenerator';

interface AdvancedReportGeneratorProps {
  data: ReportData;
  onClose: () => void;
}

interface ReportCustomization {
  template: string;
  includeCalculations: boolean;
  includeCharts: boolean;
  includeCover: boolean;
  includeAppendices: boolean;
  logoUrl?: string;
  companyName: string;
  engineerStamp: boolean;
  watermark: boolean;
  pageNumbers: boolean;
  headerFooter: boolean;
}

export const AdvancedReportGenerator: React.FC<AdvancedReportGeneratorProps> = ({
  data,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(REPORT_TEMPLATES[0]);
  const [customization, setCustomization] = useState<ReportCustomization>({
    template: REPORT_TEMPLATES[0].id,
    includeCalculations: true,
    includeCharts: true,
    includeCover: true,
    includeAppendices: false,
    companyName: 'Engineering Consultancy',
    engineerStamp: false,
    watermark: false,
    pageNumbers: true,
    headerFooter: true
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const template = REPORT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomization(prev => ({ ...prev, template: templateId }));
    }
  };

  const handleCustomizationChange = (key: keyof ReportCustomization, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const generatePreview = () => {
    setPreviewMode(true);
    const htmlContent = generateHTMLReport(data, selectedTemplate);
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    }
  };

  const handleDownload = async (format: 'html' | 'pdf') => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate generation time
      downloadReport(data, selectedTemplate, format);
    } finally {
      setIsGenerating(false);
    }
  };

  const getComplianceIcon = () => {
    if (data.compliance.isCompliant) {
      return <CheckCircle className="text-green-500" size={20} />;
    } else if (data.compliance.warnings.length > 0) {
      return <AlertTriangle className="text-yellow-500" size={20} />;
    } else {
      return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getComplianceText = () => {
    if (data.compliance.isCompliant) {
      return 'Design Compliant';
    } else if (data.compliance.warnings.length > 0) {
      return 'Design with Warnings';
    } else {
      return 'Design Non-Compliant';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="max-w-6xl mx-auto mt-8 p-4 h-full overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FileText size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Advanced Report Generator
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate professional engineering reports with customization options
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getComplianceIcon()}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {getComplianceText()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Template Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Report Templates
              </h3>
              <div className="space-y-3">
                {REPORT_TEMPLATES.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {template.sections.length} sections
                    </div>
                  </div>
                ))}
              </div>

              {/* Customization Options */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Customization
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.includeCalculations}
                      onChange={(e) => handleCustomizationChange('includeCalculations', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Detailed Calculations</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.includeCharts}
                      onChange={(e) => handleCustomizationChange('includeCharts', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Charts & Graphs</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.includeCover}
                      onChange={(e) => handleCustomizationChange('includeCover', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Cover Page</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.pageNumbers}
                      onChange={(e) => handleCustomizationChange('pageNumbers', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Page Numbers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.headerFooter}
                      onChange={(e) => handleCustomizationChange('headerFooter', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Header & Footer</span>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={customization.companyName}
                    onChange={(e) => handleCustomizationChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            {/* Template Preview & Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedTemplate.name} Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={generatePreview}
                    className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Eye size={16} className="mr-2" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Template Sections */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Report Sections
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTemplate.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="flex items-center p-3 bg-white dark:bg-gray-700 rounded border"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {section.type} • {section.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                      {section.required && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Summary */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Report Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Project:</span>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {data.projectInfo.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Engineer:</span>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {data.projectInfo.engineer}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {data.projectInfo.date}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Calculations:</span>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {data.calculations.length} steps
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="mt-4 p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getComplianceIcon()}
                      <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                        Design Compliance Status
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.compliance.isCompliant
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : data.compliance.warnings.length > 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                    }`}>
                      {data.compliance.isCompliant ? 'COMPLIANT' : 
                       data.compliance.warnings.length > 0 ? 'WITH WARNINGS' : 'NON-COMPLIANT'}
                    </span>
                  </div>
                  
                  {(data.compliance.warnings.length > 0 || data.compliance.errors.length > 0) && (
                    <div className="mt-3 space-y-2">
                      {data.compliance.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <AlertTriangle size={14} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{warning}</span>
                        </div>
                      ))}
                      {data.compliance.errors.map((error, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <XCircle size={14} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Report will be generated with {selectedTemplate.sections.length} sections
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload('html')}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Download size={16} className="mr-2" />
                {isGenerating ? 'Generating...' : 'Download HTML'}
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <FileText size={16} className="mr-2" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};