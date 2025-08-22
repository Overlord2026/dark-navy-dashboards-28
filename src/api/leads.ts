// Stub API endpoint for lead collection
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { name, email, source, timestamp } = req.body;
      
      // In a real implementation, this would save to a database
      console.log('Lead submitted:', { name, email, source, timestamp });
      
      // For now, just return success
      res.status(200).json({ 
        success: true, 
        message: 'Lead saved successfully',
        id: `lead_${Date.now()}`
      });
    } catch (error) {
      console.error('Error saving lead:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to save lead' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}