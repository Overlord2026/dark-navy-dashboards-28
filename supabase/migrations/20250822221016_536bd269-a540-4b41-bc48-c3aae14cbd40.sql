-- Create NIL receipts table for specific NIL proof slips
CREATE TABLE public.nil_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID NOT NULL,
  proof_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  anchored BOOLEAN DEFAULT false,
  anchor_txid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nil_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for NIL receipts
CREATE POLICY "Users can view their NIL receipts" 
ON public.nil_receipts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (
      profiles.role IN ('admin', 'system_administrator') OR
      profiles.id::text = entity_id
    )
  )
);

CREATE POLICY "Service role can manage NIL receipts" 
ON public.nil_receipts 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX idx_nil_receipts_entity ON public.nil_receipts(entity_id, entity_type);
CREATE INDEX idx_nil_receipts_type ON public.nil_receipts(proof_type);
CREATE INDEX idx_nil_receipts_created ON public.nil_receipts(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_nil_receipts_updated_at
  BEFORE UPDATE ON public.nil_receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_nil_updated_at();