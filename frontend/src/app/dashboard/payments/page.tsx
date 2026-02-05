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
  Add as AddIcon, Search as SearchIcon, Receipt as ReceiptIcon
} from "@mui/icons-material"

interface Payment {
  id: string
  receiptNumber: string
  customerId: string
  customer: {
    name: string
    email: string
  }
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMethod, setFilterMethod] = useState("ALL")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMethodText = (method: string) => {
    switch (method) {
      case 'CASH': return 'Tiền mặt'
      case 'BANK_TRANSFER': return 'Chuyển khoản'
      case 'ONLINE_PAYMENT': return 'Thanh toán online'
      default: return method
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = filterMethod === "ALL" || payment.paymentMethod === filterMethod
    return matchesSearch && matchesMethod
  })

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    count: payments.length,
    thisMonth: payments.filter(p => {
      const date = new Date(p.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).reduce((sum, p) => sum + p.amount, 0)
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
            Quản lý thanh toán
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi phiếu thu và thanh toán
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/payments/new"
        >
          Tạo phiếu thu mới
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {[
          { label: 'Tổng thu', value: `${stats.total.toLocaleString('vi-VN')} VND`, color: 'success' },
          { label: 'Số phiếu', value: stats.count, color: 'primary' },
          { label: 'Thu tháng này', value: `${stats.thisMonth.toLocaleString('vi-VN')} VND`, color: 'secondary' },
        ].map((stat, index) => (
          <Card key={index} sx={{ flex: '1 1 250px', minWidth: '200px', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color={`${stat.color}.main`}>
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
              placeholder="Mã phiếu thu hoặc tên khách hàng..."
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
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Phương thức</InputLabel>
              <Select
                value={filterMethod}
                label="Phương thức"
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="CASH">Tiền mặt</MenuItem>
                <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
                <MenuItem value="ONLINE_PAYMENT">Online</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã phiếu thu</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Phương thức</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ReceiptIcon color="primary" />
                    <Typography fontWeight="medium">{payment.receiptNumber}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{payment.customer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payment.customer.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium" color="success.main">
                    {payment.amount.toLocaleString('vi-VN')} VND
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getMethodText(payment.paymentMethod)}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    component={Link}
                    href={`/dashboard/payments/${payment.id}`}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPayments.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy phiếu thu nào
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Container>
  )
}
