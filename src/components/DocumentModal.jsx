import React from "react";
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
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";

const DocumentModal = ({ open, onClose, document: doc }) => {
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);

  // Reset states when modal opens or document changes
  useEffect(() => {
    if (open && doc) {
      setIsLoading(true);
      setError(null);
      setZoom(1);
    }
  }, [open, doc]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };
  
  const handleDownload = () => {
    if (doc) {
      const link = document.createElement("a");
      link.href = doc;
      // Extract filename from URL path
      const filename = doc.split("/").pop();
      link.download = filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  console.log("doc", doc);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError("Failed to load image");
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Force reload by adding timestamp
    const timestamp = new Date().getTime();
    const newUrl = doc.includes("?")
      ? `${doc}&t=${timestamp}`
      : `${doc}?t=${timestamp}`;
    if (imageRef.current) {
      imageRef.current.src = newUrl;
    }
  };

  // Check file extension from URL
  const fileExtension = doc?.split(".").pop()?.toLowerCase();
  const imageExtensions = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
    "tiff",
    "ico",
    "webp",
  ];

  const isImage = imageExtensions.includes(fileExtension);
  const isPDF = fileExtension === "pdf";
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
            This might be due to server security settings or network issues.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleRetry}
              sx={{
                borderColor: "#1E9CBC",
                color: "#1E9CBC",
                "&:hover": {
                  borderColor: "#17829B",
                  backgroundColor: "#f0f8ff",
                },
              }}
            >
              Retry
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                backgroundColor: "#1E9CBC",
                "&:hover": {
                  backgroundColor: "#17829B",
                },
              }}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.open(doc, "_blank")}
              sx={{
                borderColor: "#1E9CBC",
                color: "#1E9CBC",
                "&:hover": {
                  borderColor: "#17829B",
                  backgroundColor: "#f0f8ff",
                },
              }}
            >
              Open in New Tab
            </Button>
          </Box>
        </Box>
      );
    }

    if (isImage) {
      return (
        <Box sx={{ textAlign: "center", overflow: "auto", maxHeight: "70vh" }}>
          <img
            // ref={imageRef}
            src={doc}
            alt="Document preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              transform: `scale(${zoom})`,
              transition: "transform 0.2s ease-in-out",
            }}
            // onLoad={handleImageLoad}
            // onError={handleImageError}
          />
        </Box>
      );
    }

    if (isPDF) {
      return (
        <Box sx={{ width: "100%", height: "70vh", position: "relative" }}>
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                zIndex: 1,
              }}
            >
              <CircularProgress size={24} />
              <Typography>Loading PDF...</Typography>
            </Box>
          )}
          <iframe
            src={`${doc}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "8px",
              opacity: isLoading ? 0.3 : 1,
              transition: "opacity 0.3s ease",
            }}
            onLoad={() => {
              setIsLoading(false);
              setError(null);
            }}
            onError={() => {
              setIsLoading(false);
              setError("Failed to load PDF");
            }}
            title="PDF Document"
          />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
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
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          {doc?.split("/").pop() || "Document Viewer"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
