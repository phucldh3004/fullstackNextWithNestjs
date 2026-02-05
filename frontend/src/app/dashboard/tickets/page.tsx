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
  Add as AddIcon, Search as SearchIcon, ConfirmationNumber as TicketIcon
} from "@mui/icons-material"

interface Ticket {
  id: string
  ticketNumber: string
  title: string
  customer?: {
    name: string
    email: string
  }
  priority: string
  status: string
  assignedTo?: {
    name: string
  }
  createdAt: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'default'
      case 'IN_PROGRESS': return 'primary'
      case 'WAITING_RESPONSE': return 'warning'
      case 'RESOLVED': return 'success'
      case 'CLOSED': return 'default'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW': return 'Mới'
      case 'IN_PROGRESS': return 'Đang xử lý'
      case 'WAITING_RESPONSE': return 'Chờ phản hồi'
      case 'RESOLVED': return 'Đã giải quyết'
      case 'CLOSED': return 'Đã đóng'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'error'
      case 'MEDIUM': return 'warning'
      case 'LOW': return 'success'
      default: return 'default'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Cao'
      case 'MEDIUM': return 'Trung bình'
      case 'LOW': return 'Thấp'
      default: return priority
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || ticket.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'NEW' || t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    high: tickets.filter(t => t.priority === 'HIGH').length,
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
            Quản lý hỗ trợ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xử lý yêu cầu hỗ trợ khách hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/tickets/new"
        >
          Tạo ticket mới
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        {[
          { label: 'Tổng tickets', value: stats.total, color: 'primary' },
          { label: 'Đang mở', value: stats.open, color: 'warning' },
          { label: 'Đã giải quyết', value: stats.resolved, color: 'success' },
          { label: 'Ưu tiên cao', value: stats.high, color: 'error' },
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
              placeholder="Mã ticket hoặc tiêu đề..."
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
                <MenuItem value="IN_PROGRESS">Đang xử lý</MenuItem>
                <MenuItem value="WAITING_RESPONSE">Chờ phản hồi</MenuItem>
                <MenuItem value="RESOLVED">Đã giải quyết</MenuItem>
                <MenuItem value="CLOSED">Đã đóng</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã ticket</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Ưu tiên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người xử lý</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TicketIcon color="primary" />
                    <Typography fontWeight="medium">{ticket.ticketNumber}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{ticket.title}</Typography>
                </TableCell>
                <TableCell>
                  {ticket.customer ? (
                    <>
                      <Typography>{ticket.customer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.customer.email}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPriorityText(ticket.priority)}
                    color={getPriorityColor(ticket.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(ticket.status)}
                    color={getStatusColor(ticket.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {ticket.assignedTo ? ticket.assignedTo.name : '-'}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    component={Link}
                    href={`/dashboard/tickets/${ticket.id}`}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTickets.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">
              Không tìm thấy ticket nào
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Container>
  )
}
