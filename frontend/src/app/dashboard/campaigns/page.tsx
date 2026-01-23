"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"

interface Campaign {
  id: string
  name: string
  description?: string
  type: string
  status: string
  createdBy: string
  startDate?: string
  endDate?: string
  budget?: number
  leadCount?: number
  conversionRate?: number
  cost?: number
  revenue?: number
  createdAt: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns')
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data)
        } else {
          console.error('Failed to fetch campaigns')
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default'
      case 'ACTIVE': return 'success'
      case 'PAUSED': return 'warning'
      case 'COMPLETED': return 'primary'
      case 'CANCELLED': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Nháp'
      case 'ACTIVE': return 'Đang chạy'
      case 'PAUSED': return 'Tạm dừng'
      case 'COMPLETED': return 'Hoàn thành'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'EMAIL': return 'Email Marketing'
      case 'SOCIAL': return 'Mạng xã hội'
      case 'SEARCH': return 'Tìm kiếm'
      case 'DISPLAY': return 'Hiển thị'
      default: return type
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "ALL" || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Đang tải...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Quản lý chiến dịch
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý chiến dịch marketing và đo lường hiệu quả
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/campaigns/new"
        >
          Tạo chiến dịch mới
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {[
          {
            label: 'Tổng chiến dịch',
            value: campaigns.length,
            icon: CampaignIcon,
            color: 'primary'
          },
          {
            label: 'Đang chạy',
            value: campaigns.filter(c => c.status === 'ACTIVE').length,
            icon: TrendingUpIcon,
            color: 'success'
          },
          {
            label: 'Tổng leads',
            value: campaigns.reduce((sum, c) => sum + (c.leadCount || 0), 0),
            icon: GroupsIcon,
            color: 'secondary'
          },
          {
            label: 'Tổng doanh thu',
            value: `${campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0).toLocaleString('vi-VN')} VND`,
            icon: TrendingUpIcon,
            color: 'warning'
          },
        ].map((stat, index) => (
          <Card key={index} sx={{ flex: '1 1 250px', minWidth: '200px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                  <stat.icon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
            <TextField
              label="Tìm kiếm"
              placeholder="Tên chiến dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                label="Trạng thái"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="DRAFT">Nháp</MenuItem>
                <MenuItem value="ACTIVE">Đang chạy</MenuItem>
                <MenuItem value="PAUSED">Tạm dừng</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("ALL")
              }}
              sx={{ minWidth: 120 }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chiến dịch</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngân sách</TableCell>
              <TableCell>Leads</TableCell>
              <TableCell>Tỷ lệ chuyển đổi</TableCell>
              <TableCell>ROI</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow key={campaign.id} hover>
                <TableCell>
                  <Box>
                    <Typography fontWeight="medium">{campaign.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.description}
                    </Typography>
                    {campaign.startDate && campaign.endDate && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(campaign.startDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getTypeText(campaign.type)}
                    color="secondary"
                    size="small"
                    icon={campaign.type === 'EMAIL' ? <EmailIcon /> : <CampaignIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(campaign.status)}
                    color={getStatusColor(campaign.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {campaign.budget ? `${campaign.budget.toLocaleString('vi-VN')} VND` : 'Chưa xác định'}
                </TableCell>
                <TableCell>{campaign.leadCount || 0}</TableCell>
                <TableCell>
                  {campaign.conversionRate ? `${(campaign.conversionRate * 100).toFixed(1)}%` : 'N/A'}
                </TableCell>
                <TableCell>
                  {campaign.revenue && campaign.cost ?
                    `${((campaign.revenue - campaign.cost) / campaign.cost * 100).toFixed(1)}%` :
                    'N/A'
                  }
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    component={Link}
                    href={`/dashboard/campaigns/${campaign.id}`}
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    component={Link}
                    href={`/dashboard/campaigns/${campaign.id}/edit`}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCampaigns.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy chiến dịch nào
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Summary */}
      <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filteredCampaigns.length} trong tổng số {campaigns.length} chiến dịch
        </Typography>
      </Box>
    </Container>
  )
}
