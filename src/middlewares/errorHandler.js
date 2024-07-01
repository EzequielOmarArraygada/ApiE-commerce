const errorHandler = (err, req, res, next) => {
    console.error('Error handler:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  };
  
  export default errorHandler;
  