import { Dialog, DialogContent, Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import { X, Printer, Receipt } from 'lucide-react';

export default function ReceiptModal({ open, onClose, booking }) {
  const theme = useTheme();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const date = new Date(booking.transaction.paid_at || new Date()).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const method = booking.transaction.payment_method === 'ewallet' ? 'E-Wallet' : booking.transaction.payment_method || 'Online Payment';
    
    const customerName = booking.notes?.startsWith('Walk-in: ') ? booking.notes.replace('Walk-in: ', '') : booking.user?.name;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Struk - TRX-${booking.transaction.id}</title>
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              padding: 10px 5px; 
              font-family: 'Arial', 'Helvetica', sans-serif; 
              width: 58mm;
              font-size: 12px;
              color: #000;
              line-height: 1.4;
              font-weight: 600;
            }
            .center { text-align: center; }
            .bold { font-weight: 800; }
            .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
            .divider { border-bottom: 2px dashed #000; margin: 10px 0; }
            .divider-solid { border-bottom: 2px solid #000; margin: 10px 0; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mt-2 { margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="center mb-2">
            <div class="bold" style="font-size: 22px; letter-spacing: 1px;">BACCARAT</div>
            <div style="font-size: 11px; margin-top: 5px; font-weight: normal;">Jl. Merdeka No. 123, Jakarta</div>
            <div style="font-size: 11px; font-weight: normal;">Telp: 0812-3456-7890</div>
          </div>
          
          <div class="divider"></div>

          <div class="mb-2" style="font-size: 11px; font-weight: normal;">
            <div class="flex-between mb-1"><span>Waktu</span> <span>${date}</span></div>
            <div class="flex-between mb-1"><span>No. TRX</span> <span>#${booking.transaction.id}</span></div>
            <div class="flex-between mb-1"><span>Kasir</span> <span>Admin</span></div>
            <div class="flex-between mb-1"><span>Pelanggan</span> <span>${customerName || 'Walk-in'}</span></div>
          </div>

          <div class="divider-solid"></div>

          <div class="mb-2">
            <div class="bold mb-1" style="font-size: 13px; text-transform: uppercase;">SEWA MEJA: ${booking.table?.name || 'Standard'}</div>
            <div class="flex-between" style="font-size: 12px;">
              <span>${Math.abs(booking.duration_hours)} Jam</span>
              <span class="bold">${booking.total_price_formatted.replace('-', '')}</span>
            </div>
            <div style="font-size: 11px; font-weight: normal; margin-top: 2px;">
              Jam: ${booking.start_time} - ${booking.end_time}
            </div>
          </div>

          <div class="divider-solid"></div>

          <div class="mb-2 mt-2">
             <div class="flex-between bold" style="font-size: 16px;">
              <span>TOTAL</span>
              <span>${booking.total_price_formatted.replace('-', '')}</span>
            </div>
             <div class="flex-between" style="margin-top: 6px; font-size: 12px;">
              <span>Tipe Bayar</span>
              <span class="bold" style="text-transform: uppercase;">${method}</span>
            </div>
          </div>

          <div class="divider"></div>
          
          <div class="center mt-2" style="font-size: 11px;">
            <div class="bold mb-1">Wifi: billiard_guest</div>
            <div class="bold mb-2">Pass: mainbilliard123</div>
            <div class="bold" style="margin-top: 15px;">TERIMA KASIH</div>
            <div style="font-weight: normal;">ATAS KUNJUNGAN ANDA!</div>
            <div style="margin-top: 10px; font-size: 9px; font-weight: normal; font-style: italic;">Powered by Baccarat System</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!booking || !booking.transaction) return null;

  const customerName = booking.notes?.startsWith('Walk-in: ') ? booking.notes.replace('Walk-in: ', '') : booking.user?.name;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.100' }}>
        <Typography variant="subtitle1" fontWeight={700} display="flex" alignItems="center" gap={1}>
          <Receipt size={20} color={theme.palette.primary.main} />
          Struk Pembayaran
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: 'grey.100', display: 'flex', justifyContent: 'center', py: 4 }}>
        {/* Preview struk 58mm */}
        <Box id="receipt-content" sx={{ 
          width: '280px', 
          bgcolor: '#fff', 
          p: 2.5, 
          color: '#000',
          fontFamily: "'Arial', 'Helvetica', sans-serif",
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          fontWeight: 600,
          lineHeight: 1.4
        }}>
          
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: 'inherit', fontWeight: 900, fontSize: '22px', letterSpacing: 1 }}>
              BACCARAT
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', mt: 0.5, fontWeight: 400 }}>
              Jl. Merdeka No. 123, Jakarta
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', fontWeight: 400 }}>
              Telp: 0812-3456-7890
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', borderBottom: '2px dashed #000', mb: 1.5 }}></Typography>

          {/* Info Transaksi */}
          <Box sx={{ mb: 2, fontSize: '11px', fontWeight: 400 }}>
            <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <span>Waktu</span> 
              <span>{new Date(booking.transaction.paid_at || new Date()).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <span>No. TRX</span> 
              <span>#{booking.transaction.id}</span>
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <span>Kasir</span> 
              <span>Admin</span>
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pelanggan</span> 
              <span>{customerName || 'Walk-in'}</span>
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', borderBottom: '2px solid #000', mb: 1.5 }}></Typography>

          {/* Item */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 800, mb: 0.5, textTransform: 'uppercase' }}>
              SEWA MEJA: {booking.table?.name || 'Standard'}
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{Math.abs(booking.duration_hours)} Jam</span>
              <span style={{ fontWeight: 800 }}>{booking.total_price_formatted.replace('-', '')}</span>
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', fontWeight: 400, mt: 0.5 }}>
              Jam: {booking.start_time} - {booking.end_time}
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', borderBottom: '2px solid #000', mb: 1.5 }}></Typography>

          {/* Total */}
          <Box sx={{ mb: 2 }}>
             <Typography sx={{ fontFamily: 'inherit', fontSize: '16px', fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
              <span>TOTAL</span>
              <span>{booking.total_price_formatted.replace('-', '')}</span>
            </Typography>
             <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <span>Tipe Bayar</span>
              <span style={{ fontWeight: 800, textTransform: 'uppercase' }}>{booking.transaction.payment_method === 'ewallet' ? 'E-Wallet' : booking.transaction.payment_method || 'Online Payment'}</span>
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', borderBottom: '2px dashed #000', mb: 1.5 }}></Typography>
          
          {/* Footer */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', fontWeight: 800, mb: 0.5 }}>
              Wifi: billiard_guest
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', fontWeight: 800, mb: 2 }}>
              Pass: mainbilliard123
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '12px', fontWeight: 800 }}>
              TERIMA KASIH
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '11px', fontWeight: 400 }}>
              ATAS KUNJUNGAN ANDA!
            </Typography>
            <Typography sx={{ fontFamily: 'inherit', fontSize: '9px', mt: 1.5, fontWeight: 400, fontStyle: 'italic' }}>
              Powered by Baccarat System
            </Typography>
          </Box>
          
        </Box>
      </DialogContent>

      <Box sx={{ p: 2, display: 'flex', gap: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<Printer size={18} />}
          onClick={handlePrint}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Cetak Struk
        </Button>
      </Box>
    </Dialog>
  );
}
