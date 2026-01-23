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

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  customerType: string
  status: string
  assignedTo?: string
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
        if (response.ok) {
          const data = await response.json()
          setCustomers(data)
        } else {
          console.error('Failed to fetch customers')
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || customer.status === filterStatus
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
            Quản lý khách hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý thông tin khách hàng chính thức
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/customers/new"
        >
          Thêm khách hàng mới
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
            <TextField
              label="Tìm kiếm"
              placeholder="Tên hoặc email..."
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
                <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
                <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
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

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {customer.customerType === 'INDIVIDUAL' ? <PersonIcon /> : <BusinessIcon />}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="medium">{customer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                      {customer.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {customer.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.customerType === 'INDIVIDUAL' ? 'Cá nhân' : 'Doanh nghiệp'}
                    color={customer.customerType === 'INDIVIDUAL' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                    color={customer.status === 'ACTIVE' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    component={Link}
                    href={`/dashboard/customers/${customer.id}`}
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    component={Link}
                    href={`/dashboard/customers/${customer.id}/edit`}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy khách hàng nào
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Summary */}
      <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filteredCustomers.length} trong tổng số {customers.length} khách hàng
        </Typography>
      </Box>
    </Container>
  )
}
