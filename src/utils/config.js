const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",
  parentDocumentUrl: process.env.REACT_APP_PARENT_DOCUMENT_URL || "http://localhost:301",
  tutorDocumentUrl: process.env.REACT_APP_TUTOR_DOCUMENT_URL || "http://localhost:303",
};

export default config;