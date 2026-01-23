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
  Person as PersonIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source?: string
  status: string
  assignedTo?: string
  budget?: number
  timeline?: string
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          setLeads(data)
        } else {
          console.error('Failed to fetch leads')
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'default'
      case 'CONTACTING': return 'primary'
      case 'INTERESTED': return 'warning'
      case 'NOT_POTENTIAL': return 'error'
      case 'CONVERTED': return 'success'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW': return 'Mới'
      case 'CONTACTING': return 'Đang liên hệ'
      case 'INTERESTED': return 'Quan tâm'
      case 'NOT_POTENTIAL': return 'Không tiềm năng'
      case 'CONVERTED': return 'Đã chuyển đổi'
      default: return status
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "ALL" || lead.status === filterStatus
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
            Quản lý Leads
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý khách hàng tiềm năng
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/leads/new"
        >
          Thêm Lead mới
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {[
          { label: 'Tổng leads', value: leads.length, color: 'primary' },
          { label: 'Lead mới', value: leads.filter(l => l.status === 'NEW').length, color: 'default' },
          { label: 'Đang liên hệ', value: leads.filter(l => l.status === 'CONTACTING').length, color: 'primary' },
          { label: 'Quan tâm', value: leads.filter(l => l.status === 'INTERESTED').length, color: 'warning' },
          { label: 'Đã chuyển đổi', value: leads.filter(l => l.status === 'CONVERTED').length, color: 'success' },
        ].map((stat, index) => (
          <Card key={index} sx={{ flex: '1 1 200px', minWidth: '150px', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
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
              placeholder="Tên, email hoặc công ty..."
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
                <MenuItem value="NEW">Mới</MenuItem>
                <MenuItem value="CONTACTING">Đang liên hệ</MenuItem>
                <MenuItem value="INTERESTED">Quan tâm</MenuItem>
                <MenuItem value="NOT_POTENTIAL">Không tiềm năng</MenuItem>
                <MenuItem value="CONVERTED">Đã chuyển đổi</MenuItem>
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

      {/* Leads Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead</TableCell>
              <TableCell>Nguồn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngân sách</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {lead.company ? <BusinessIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="medium">{lead.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lead.email}
                      </Typography>
                      {lead.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {lead.phone}
                        </Typography>
                      )}
                      {lead.company && (
                        <Typography variant="body2" color="primary.main">
                          {lead.company}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.source || 'Chưa xác định'}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(lead.status)}
                    color={getStatusColor(lead.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {lead.budget ? `${lead.budget.toLocaleString('vi-VN')} VND` : 'Chưa xác định'}
                </TableCell>
                <TableCell>
                  {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    component={Link}
                    href={`/dashboard/leads/${lead.id}`}
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    component={Link}
                    href={`/dashboard/leads/${lead.id}/edit`}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLeads.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy lead nào
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Summary */}
      <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filteredLeads.length} trong tổng số {leads.length} leads
        </Typography>
      </Box>
    </Container>
  )
}
