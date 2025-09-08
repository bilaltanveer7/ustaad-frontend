import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { useState, useRef } from 'react';

const DocumentModal = ({ open, onClose, document: doc }) => {
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    if (doc) {
      const link = document.createElement('a');
      link.href = doc;
      // Extract filename from URL path
      const filename = doc.split('/').pop();
      link.download = filename || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load document');
  };

  // Check file extension from URL
  const fileExtension = doc?.split('.').pop()?.toLowerCase();
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'webp'];
  
  const isImage = imageExtensions.includes(fileExtension);
  const isPDF = fileExtension === 'pdf';
  const renderContent = () => {
    // if (isLoading) {
    //   return (
    //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    //       <CircularProgress />
    //     </Box>
    //   );
    // }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (isImage) {
      return (
        <Box sx={{ textAlign: 'center', overflow: 'auto', maxHeight: '70vh' }}>
          <img
            // ref={imageRef}
            src={doc}
            alt="Document preview"
            style={{
              maxWidth: '100%',
              height: 'auto',
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease-in-out',
            }}
            // onLoad={handleImageLoad}
            // onError={handleImageError}
          />
        </Box>
      );
    }

    if (isPDF) {
      return (
        <Box sx={{ width: '100%', height: '70vh' }}>
          <iframe
            src={`${doc}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Failed to load PDF');
            }}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Unsupported document type</Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {doc?.split('/').pop() || 'Document Viewer'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isImage && (
            <>
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomInIcon />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleDownload} size="small" color="primary">
            <DownloadIcon />
          </IconButton>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        {renderContent()}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentModal;