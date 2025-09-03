import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, FileText, Calendar, Filter, Search } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

interface ReportData {
  totalRevenue?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  [key: string]: any;
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<{
    salesReport: ReportData;
    inventoryReport: ReportData;
    customerReport: ReportData;
    orderReport: ReportData;
  }>({
    salesReport: {},
    inventoryReport: {},
    customerReport: {},
    orderReport: {},
  });
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
  }, [selectedReport, dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/reports?type=${selectedReport}&dateRange=${dateRange}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/reports/export?type=${type}&dateRange=${dateRange}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp, description: 'Revenue and sales performance' },
    { id: 'inventory', name: 'Inventory Report', icon: FileText, description: 'Product stock levels and movement' },
    { id: 'customer', name: 'Customer Report', icon: FileText, description: 'Customer demographics and behavior' },
    { id: 'order', name: 'Order Report', icon: FileText, description: 'Order status and fulfillment' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and export comprehensive business reports</p>
      </div>

      {/* Report Type Selector */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedReport === report.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <report.icon className={`h-5 w-5 mr-2 ${
                  selectedReport === report.id ? 'text-primary-500' : 'text-gray-500'
                }`} />
                <span className={`font-medium ${
                  selectedReport === report.id ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {report.name}
                </span>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Search:</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <button
          onClick={() => exportReport(selectedReport)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Content */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {reportTypes.find(r => r.id === selectedReport)?.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sales Report */}
            {selectedReport === 'sales' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">₹{reports.salesReport.totalRevenue || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Total Orders</p>
                    <p className="text-2xl font-bold text-green-900">{reports.salesReport.totalOrders || 0}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-600">Average Order Value</p>
                    <p className="text-2xl font-bold text-yellow-900">₹{reports.salesReport.averageOrderValue || 0}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Sales Data</h4>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Sales data will be displayed here</p>
                    <p className="text-sm text-gray-500">Detailed sales information coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Report */}
            {selectedReport === 'inventory' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Summary</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Stock Levels</h4>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Inventory data will be displayed here</p>
                    <p className="text-sm text-gray-500">Stock levels and movement coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Report */}
            {selectedReport === 'customer' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Customer Demographics</h4>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Customer data will be displayed here</p>
                    <p className="text-sm text-gray-500">Customer insights coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Report */}
            {selectedReport === 'order' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Order Status</h4>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Order data will be displayed here</p>
                    <p className="text-sm text-gray-500">Order fulfillment details coming soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports; 