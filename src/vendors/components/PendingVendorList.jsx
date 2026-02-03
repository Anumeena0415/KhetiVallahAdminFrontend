import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Avatar,
  Stack
} from '@mui/material';
import { VisibilityOutlined, Email, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import VendorTable from '../components/VendorTable';
import { useVendor } from '../../api/vendor';

const PendingVendorList = () => {
  const navigate = useNavigate();
  const { getVendors, approveVendor, rejectVendor, loading } = useVendor();

  const [vendors, setVendors] = useState([]);
  const [busy, setBusy] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, vendor: null, reason: '' });

  // Normalize incoming API data into UI shape
  const normalize = (arr) => {
    return arr.map(v => ({
      id: v._id,
      name: v.farmName || v.name,
      email: v.user?.email,
      ownerName: v.user?.name,
      ownerPhone: v.user?.phone,
      status: v.verification?.status || 'PENDING',  // PENDING | APPROVED | REJECTED
    }));
  };

  useEffect(() => {
    const init = async () => {
      const res = await getVendors({ verificationStatus: 'PENDING' }).catch(() => null);

      if (res?.success && Array.isArray(res.data)) {
        setVendors(normalize(res.data));
      } else {
        setVendors([]);
      }
    };

    init();
  }, [getVendors]);

  const patchVendor = (id, data) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const handleApprove = async id => {
    setBusy(id);
    const res = await approveVendor(id).catch(() => null);
    if (res?.success) patchVendor(id, { status: 'APPROVED' });
    setBusy(null);
  };

  const handleRejectConfirm = async () => {
    const vendor = rejectModal.vendor;
    if (!vendor) return;

    const id = vendor.id;
    setBusy(id);

    const res = await rejectVendor(id, rejectModal.reason).catch(() => null);
    if (res?.success) patchVendor(id, { status: 'REJECTED' });

    setBusy(null);
    setRejectModal({ open: false, vendor: null, reason: '' });
  };

  const columns = useMemo(
    () => [
      {
        key: 'vendor',
        label: 'Vendor',
        render: v => (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{(v.name || 'V')[0]}</Avatar>
            <Box>
              <Typography fontWeight={600}>{v.name}</Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                <Email sx={{ fontSize: 12 }} /> {v.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        key: 'owner',
        label: 'Owner',
        render: v => (
          <Box>
            <Typography>{v.ownerName}</Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
              <Phone sx={{ fontSize: 12 }} /> {v.ownerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: v => {
          if (v.status === 'APPROVED')
            return <Chip label="Approved" color="success" size="small" />;

          if (v.status === 'REJECTED')
            return <Chip label="Rejected" color="error" size="small" />;

          return <Chip label="Pending" color="warning" size="small" variant="outlined" />;
        }
      },
      {
        key: 'actions',
        label: 'Actions',
        render: v => {
          const isBusy = busy === v.id;
          const decided = v.status !== 'PENDING';

          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="View Profile">
                <IconButton size="small" onClick={() => navigate(`/vendor/${v.id}`)}>
                  <VisibilityOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              {!decided && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(v.id)}
                    disabled={isBusy}
                  >
                    {isBusy ? <CircularProgress size={16} color="inherit" /> : 'Approve'}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isBusy}
                    onClick={() => setRejectModal({ open: true, vendor: v, reason: '' })}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Stack>
          );
        }
      }
    ],
    [busy, navigate]
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f7f9', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e4e8' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Vendor Requests</Typography>
            <Typography variant="body2" color="text.secondary">
              Review incoming vendor applications
            </Typography>
          </Box>
          <Chip label={`${vendors.length} Vendors`} color="primary" />
        </Box>

        {loading && vendors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <VendorTable columns={columns} rows={vendors} />
        )}
      </Paper>

      <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, vendor: null, reason: '' })}>
        <DialogTitle>Reject Vendor</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            autoFocus
            label="Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectModal.reason}
            onChange={e => setRejectModal(m => ({ ...m, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectModal({ open: false, vendor: null, reason: '' })}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!rejectModal.reason.trim()}
            onClick={handleRejectConfirm}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingVendorList;
