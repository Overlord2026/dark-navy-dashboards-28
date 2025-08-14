// Simple inventory endpoint for React Router/Vite setup
import { supabase } from '@/integrations/supabase/client';
import { PERSONA_LINKS, MEGA_MENU_CONFIG } from '@/config/persona-links';
import { PersonaKind, PERSONA_CONFIGS } from '@/types/persona';

interface InventoryResponse {
  personas: {
    db: Array<{
      id: string;
      persona_kind: string;
      tenant_id?: string;
      user_id?: string;
      metadata?: any;
    }>;
    code_persona_kinds: PersonaKind[];
    configurations: Record<PersonaKind, any>;
  };
  menus: {
    mega_menu: typeof MEGA_MENU_CONFIG;
    persona_links: typeof PERSONA_LINKS;
  };
  tools: {
    swag_modules: boolean;
    accounting_os: boolean;
    revocation_center: boolean;
    persona_switcher: boolean;
    integrations: boolean;
    brand_banner: boolean;
    pdf_export: boolean;
    trust_scoring: boolean;
  };
  metadata: {
    timestamp: string;
    version: string;
    environment: string;
  };
}

export async function getInventory(): Promise<InventoryResponse> {
  // Get personas from database if available
  let dbPersonas = [];
  try {
    const { data: personas, error } = await supabase
      .from('personas')
      .select('id, persona_kind, tenant_id, user_id, metadata')
      .limit(100);
    
    if (!error && personas) {
      dbPersonas = personas;
    }
  } catch (dbError) {
    console.warn('Could not fetch personas from database:', dbError);
  }

  const codePersonaKinds = Object.keys(PERSONA_CONFIGS) as PersonaKind[];

  const tools = {
    swag_modules: true,
    accounting_os: true,
    revocation_center: true,
    persona_switcher: true,
    integrations: true,
    brand_banner: true,
    pdf_export: true,
    trust_scoring: true,
  };

  return {
    personas: {
      db: dbPersonas,
      code_persona_kinds: codePersonaKinds,
      configurations: PERSONA_CONFIGS,
    },
    menus: {
      mega_menu: MEGA_MENU_CONFIG,
      persona_links: PERSONA_LINKS,
    },
    tools,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: import.meta.env?.MODE || 'development',
    },
  };
}