const config = {
  // Use environment variables first, then fallback to remote servers
  apiUrl: process.env.REACT_APP_API_URL || "http://15.235.204.49:5000",
  parentDocumentUrl: process.env.REACT_APP_PARENT_DOCUMENT_URL || "http://15.235.204.49:301",
  tutorDocumentUrl: process.env.REACT_APP_TUTOR_DOCUMENT_URL || "http://15.235.204.49:303",
  
  // Alternative localhost configuration (uncomment if running locally)
  // apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",
  // parentDocumentUrl: process.env.REACT_APP_PARENT_DOCUMENT_URL || "http://localhost:301",
  // tutorDocumentUrl: process.env.REACT_APP_TUTOR_DOCUMENT_URL || "http://localhost:303",
};

export default config;