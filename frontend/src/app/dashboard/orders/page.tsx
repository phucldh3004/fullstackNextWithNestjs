"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Box, Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, TextField,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent,
  InputAdornment, CircularProgress
} from "@mui/material"
import {
  Add as AddIcon, Search as SearchIcon, ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material"

interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: {
    name: string
    email: string
  }
  status: string
  totalAmount: number
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'default'
      case 'PROCESSING': return 'primary'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW': return 'Mới'
      case 'PROCESSING': return 'Đang xử lý'
      case 'COMPLETED': return 'Hoàn thành'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'NEW').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Quản lý đơn hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý quy trình bán hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/orders/new"
        >
          Tạo đơn hàng mới
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {[
          { label: 'Tổng đơn hàng', value: stats.total, color: 'primary' },
          { label: 'Đơn mới', value: stats.new, color: 'default' },
          { label: 'Đang xử lý', value: stats.processing, color: 'primary' },
          { label: 'Hoàn thành', value: stats.completed, color: 'success' },
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
            <TextField
              label="Tìm kiếm"
              placeholder="Mã đơn hàng hoặc tên khách hàng..."
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
                <MenuItem value="PROCESSING">Đang xử lý</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingCartIcon color="primary" />
                    <Typography fontWeight="medium">{order.orderNumber}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{order.customer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">
                    {order.totalAmount.toLocaleString('vi-VN')} VND
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    component={Link}
                    href={`/dashboard/orders/${order.id}`}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy đơn hàng nào
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Container>
  )
}
