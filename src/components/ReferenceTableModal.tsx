import React from 'react';
import { X, Book, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ReferenceTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: (mixRatio: string) => void;
}

interface ConcreteMix {
  ratio: string;
  grade: string;
  application: string;
  fck: number;
  dryVolumeFactor: number;
  wastageFactor: number;
  explanation: string;
  cementContent: number; // kg/m³
  waterCementRatio: number;
  workability: string;
  durability: string;
}

const CONCRETE_MIXES: ConcreteMix[] = [
  {
    ratio: '1:1.5:3',
    grade: 'M20',
    application: 'RCC beams, slabs, columns',
    fck: 20,
    dryVolumeFactor: 1.52,
    wastageFactor: 1.02,
    explanation: 'M20 grade concrete is widely used for RCC work. The rich mix (1:1.5:3) provides good strength and durability. Lower dry volume factor due to better packing.',
    cementContent: 383,
    waterCementRatio: 0.55,
    workability: 'Good',
    durability: 'High'
  },
  {
    ratio: '1:2:4',
    grade: 'M15',
    application: 'Footings, mass concrete',
    fck: 15,
    dryVolumeFactor: 1.54,
    wastageFactor: 1.03,
    explanation: 'M15 grade is suitable for plain concrete work and lightly loaded structures. Moderate cement content makes it economical for mass concrete work.',
    cementContent: 320,
    waterCementRatio: 0.60,
    workability: 'Fair',
    durability: 'Medium'
  },
  {
    ratio: '1:3:6',
    grade: 'M10',
    application: 'Blinding, leveling course',
    fck: 10,
    dryVolumeFactor: 1.57,
    wastageFactor: 1.05,
    explanation: 'M10 grade is a lean mix used for non-structural applications. Higher dry volume factor due to more voids. Suitable for mass concrete and blinding.',
    cementContent: 210,
    waterCementRatio: 0.70,
    workability: 'Poor',
    durability: 'Low'
  },
  {
    ratio: '1:1:2',
    grade: 'M25',
    application: 'Prestressed concrete, high-rise',
    fck: 25,
    dryVolumeFactor: 1.50,
    wastageFactor: 1.01,
    explanation: 'M25 grade provides high strength suitable for prestressed concrete and high-rise buildings. Very rich mix with excellent durability characteristics.',
    cementContent: 450,
    waterCementRatio: 0.50,
    workability: 'Excellent',
    durability: 'Very High'
  },
  {
    ratio: '1:1.2:2.4',
    grade: 'M30',
    application: 'High-strength structural elements',
    fck: 30,
    dryVolumeFactor: 1.48,
    wastageFactor: 1.00,
    explanation: 'M30 grade is used for high-strength applications. Very low wastage due to controlled mixing. Excellent for critical structural elements.',
    cementContent: 500,
    waterCementRatio: 0.45,
    workability: 'Very Good',
    durability: 'Excellent'
  }
];

export const ReferenceTableModal: React.FC<ReferenceTableModalProps> = ({
  isOpen,
  onClose,
  onLoadExample
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleRowClick = (mix: ConcreteMix) => {
    onLoadExample(mix.ratio);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="max-w-6xl mx-auto mt-8 p-4 h-full overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Book size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Concrete Mix Design Reference
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard concrete mix ratios and their applications
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                How to Use This Reference
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Click on any row to load that mix ratio as an example</li>
                <li>• Review the applications to select appropriate concrete grade</li>
                <li>• Consider exposure conditions when selecting mix ratios</li>
                <li>• Dry volume and wastage factors are included for accurate calculations</li>
              </ul>
            </div>

            {/* Reference Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      Mix Ratio
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      Grade
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      fck (MPa)
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      Application
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      Cement Content
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      W/C Ratio
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                      Workability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONCRETE_MIXES.map((mix, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(mix)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    >
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        <div className="font-medium text-blue-600 dark:text-blue-400">
                          {mix.ratio}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          C:S:A
                        </div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm font-medium">
                          {mix.grade}
                        </span>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium">
                        {mix.fck}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        <div className="text-sm">{mix.application}</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        <div className="font-medium">{mix.cementContent} kg/m³</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        {mix.waterCementRatio}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          mix.workability === 'Excellent' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          mix.workability === 'Very Good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                          mix.workability === 'Good' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          mix.workability === 'Fair' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {mix.workability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Information */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Design Factors */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Design Factors Explained
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Dry Volume Factor</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Accounts for voids in aggregates. Richer mixes have lower factors (1.48-1.52) due to better packing.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Wastage Factor</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Accounts for material wastage during construction. Typically 1-5% depending on site conditions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Water-Cement Ratio</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Critical for strength and durability. Lower ratios give higher strength but may reduce workability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code References */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Code References
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <ExternalLink size={16} className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">IS 456:2000</div>
                      <div className="text-gray-600 dark:text-gray-400">Plain and Reinforced Concrete - Code of Practice</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ExternalLink size={16} className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">IS 10262:2019</div>
                      <div className="text-gray-600 dark:text-gray-400">Concrete Mix Proportioning - Guidelines</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ExternalLink size={16} className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">SP 23:1982</div>
                      <div className="text-gray-600 dark:text-gray-400">Handbook on Concrete Mixes</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ExternalLink size={16} className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">IS 383:2016</div>
                      <div className="text-gray-600 dark:text-gray-400">Coarse and Fine Aggregates - Specification</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                Important Guidelines
              </h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• These are nominal mixes. For critical structures, use designed mixes as per IS 10262</li>
                <li>• Consider local aggregate properties and environmental conditions</li>
                <li>• Conduct trial mixes for important projects</li>
                <li>• Ensure proper curing for achieving design strength</li>
                <li>• Quality control testing is essential for structural concrete</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Click any row to load example values into the calculator
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};