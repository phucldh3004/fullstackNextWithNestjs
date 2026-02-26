"use client"

import { useState, useEffect } from "react"

interface ReportData {
  customerReport: {
    totalCustomers: number
    newCustomersThisMonth: number
    activeCustomers: number
    customerGrowth: number
  }
  leadReport: {
    totalLeads: number
    newLeadsThisMonth: number
    conversionRate: number
    leadSources: { source: string; count: number }[]
  }
  campaignReport: {
    totalCampaigns: number
    activeCampaigns: number
    totalBudget: number
    totalRevenue: number
    averageROI: number
  }
  ticketReport: {
    totalTickets: number
    openTickets: number
    resolvedTickets: number
    averageResolutionTime: number
  }
  revenueReport: {
    monthlyRevenue: number[]
    monthlyGrowth: number
    totalRevenue: number
    projectedRevenue: number
  }
}

export default function ReportsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("THIS_MONTH")

  useEffect(() => {
    setIsMounted(true)
    // Mock data for now
    const mockData: ReportData = {
      customerReport: {
        totalCustomers: 1250,
        newCustomersThisMonth: 45,
        activeCustomers: 1180,
        customerGrowth: 12.5
      },
      leadReport: {
        totalLeads: 450,
        newLeadsThisMonth: 67,
        conversionRate: 18.5,
        leadSources: [
          { source: "Website", count: 180 },
          { source: "Facebook Ads", count: 120 },
          { source: "Google Ads", count: 95 },
          { source: "Email Marketing", count: 55 }
        ]
      },
      campaignReport: {
        totalCampaigns: 12,
        activeCampaigns: 5,
        totalBudget: 45000000,
        totalRevenue: 125000000,
        averageROI: 178.5
      },
      ticketReport: {
        totalTickets: 285,
        openTickets: 23,
        resolvedTickets: 262,
        averageResolutionTime: 4.2
      },
      revenueReport: {
        monthlyRevenue: [85000000, 92000000, 110000000, 125000000, 98000000, 105000000],
        monthlyGrowth: 15.2,
        totalRevenue: 615000000,
        projectedRevenue: 750000000
      }
    }

    setTimeout(() => {
      setReportData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!reportData) {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất kinh doanh</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="THIS_MONTH">Tháng này</option>
          <option value="LAST_MONTH">Tháng trước</option>
          <option value="THIS_QUARTER">Quý này</option>
          <option value="THIS_YEAR">Năm nay</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {(reportData.revenueReport.totalRevenue / 1000000).toFixed(0)}M VND
              </p>
              <p className="text-sm text-green-600">
                +{reportData.revenueReport.monthlyGrowth}% so với tháng trước
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.customerReport.newCustomersThisMonth}
              </p>
              <p className="text-sm text-blue-600">
                +{reportData.customerReport.customerGrowth}% tăng trưởng
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.leadReport.conversionRate}%
              </p>
              <p className="text-sm text-purple-600">
                Từ {reportData.leadReport.totalLeads} leads
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI Marketing</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.campaignReport.averageROI}%
              </p>
              <p className="text-sm text-orange-600">
                Trên {reportData.campaignReport.totalCampaigns} chiến dịch
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Report */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Báo cáo khách hàng</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng khách hàng</span>
              <span className="font-semibold">{reportData.customerReport.totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khách hàng mới (tháng này)</span>
              <span className="font-semibold text-green-600">+{reportData.customerReport.newCustomersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khách hàng hoạt động</span>
              <span className="font-semibold">{reportData.customerReport.activeCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tỷ lệ tăng trưởng</span>
              <span className="font-semibold text-blue-600">+{reportData.customerReport.customerGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nguồn leads</h3>
          <div className="space-y-3">
            {reportData.leadReport.leadSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{source.source}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(source.count / Math.max(...reportData.leadReport.leadSources.map(s => s.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold text-sm">{source.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất chiến dịch</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng ngân sách</span>
              <span className="font-semibold">{(reportData.campaignReport.totalBudget / 1000000).toFixed(0)}M VND</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng doanh thu</span>
              <span className="font-semibold text-green-600">{(reportData.campaignReport.totalRevenue / 1000000).toFixed(0)}M VND</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ROI trung bình</span>
              <span className="font-semibold text-blue-600">{reportData.campaignReport.averageROI}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chiến dịch đang chạy</span>
              <span className="font-semibold">{reportData.campaignReport.activeCampaigns}/{reportData.campaignReport.totalCampaigns}</span>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng tickets</span>
              <span className="font-semibold">{reportData.ticketReport.totalTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tickets đang mở</span>
              <span className="font-semibold text-orange-600">{reportData.ticketReport.openTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tickets đã giải quyết</span>
              <span className="font-semibold text-green-600">{reportData.ticketReport.resolvedTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian giải quyết TB</span>
              <span className="font-semibold">{reportData.ticketReport.averageResolutionTime} giờ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {reportData.revenueReport.monthlyRevenue.map((revenue, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-600 rounded-t w-full mb-2"
                style={{
                  height: `${(revenue / Math.max(...reportData.revenueReport.monthlyRevenue)) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <span className="text-xs text-gray-600">
                {(revenue / 1000000).toFixed(0)}M
              </span>
              <span className="text-xs text-gray-500">
                T{index + 7}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Dự kiến doanh thu năm: <span className="font-semibold text-green-600">
              {(reportData.revenueReport.projectedRevenue / 1000000).toFixed(0)}M VND
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
