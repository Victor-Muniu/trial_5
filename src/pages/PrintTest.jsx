import React, { useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

const TestPrint = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <h1>Print Preview Test</h1>
    <p>This is a test content to check printing functionality.</p>
  </div>
));

function PrintTest() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const printRef = useRef(null);

  return (
    <div>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Open Print Preview
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Print Preview</DialogTitle>
        <DialogContent dividers>
          <TestPrint ref={printRef} />
        </DialogContent>
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                Print
              </Button>
            )}
            content={() => printRef.current}
          />
        </Box>
      </Dialog>
    </div>
  );
}

export default PrintTest;
