import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Mail, Video, FileText, Globe, Languages } from 'lucide-react';
import { toast } from 'sonner';

const CampaignMaterials: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('common.success'));
  };

  const emailTemplates = {
    en: {
      subject: "Welcome to the Global Boutique Family Office Platform—Your VIP Invitation",
      body: `Hi [Name],

We're excited to announce the global launch of Boutique Family Office Platform™—now available in your language and country.

As a [family/wealth manager/advisor/industry leader], you're invited to be among the first to experience our secure, AI-powered digital office.

Activate your VIP account now: [Link]

Your language. Your security. Your family office—worldwide.

Best regards,
The BFOCFO Team`
    },
    es: {
      subject: "Bienvenido a Boutique Family Office Platform™—Tu Invitación VIP",
      body: `Hola [Nombre],

Estamos encantados de anunciar el lanzamiento global de Boutique Family Office Platform™—ya disponible en tu idioma y país.

Como [familia/asesor/líder del sector], tienes una invitación VIP para probar nuestra plataforma privada impulsada por IA.

Activa tu cuenta VIP aquí: [Enlace]

Tu idioma. Tu seguridad. Tu family office—mundial.

Saludos cordiales,
El Equipo BFOCFO`
    },
    fr: {
      subject: "Bienvenue sur Boutique Family Office Platform™—Votre Invitation VIP",
      body: `Bonjour [Nom],

Nous lançons Boutique Family Office Platform™ à l'échelle mondiale—désormais disponible dans votre langue et pays.

Comme [famille/conseiller/leader], vous bénéficiez d'une invitation VIP pour découvrir notre plateforme privée alimentée par l'IA.

Activez votre compte VIP ici: [Lien]

Votre langue. Votre sécurité. Votre family office—mondial.

Cordialement,
L'Équipe BFOCFO`
    }
  };

  const videoScripts = {
    short: {
      en: `[30-second Global Video Script]

Tony (Voiceover):
"The world is changing—your family's needs are global, your legacy is borderless. Introducing the Boutique Family Office Platform™—the first global, AI-powered digital office for families and their trusted advisors.

See everything. Organize everything. Connect with the best—wherever you live, in your language.

Join us—because every family, everywhere, deserves a true family office. Get started free today."`,
      
      es: `[Guión de Video Global de 30 segundos]

Tony (Voz en off):
"El mundo está cambiando—las necesidades de tu familia son globales, tu legado no tiene fronteras. Presentamos Boutique Family Office Platform™—la primera oficina digital global impulsada por IA para familias y sus asesores de confianza.

Ve todo. Organiza todo. Conecta con los mejores—donde sea que vivas, en tu idioma.

Únete—porque cada familia, en todas partes, merece una verdadera family office. Comienza gratis hoy."`,
      
      fr: `[Script Vidéo Global de 30 secondes]

Tony (Voix off):
"Le monde change—les besoins de votre famille sont globaux, votre héritage n'a pas de frontières. Voici Boutique Family Office Platform™—le premier bureau numérique mondial alimenté par l'IA pour les familles et leurs conseillers de confiance.

Voyez tout. Organisez tout. Connectez-vous avec les meilleurs—où que vous viviez, dans votre langue.

Rejoignez-nous—car chaque famille, partout, mérite un vrai family office. Commencez gratuitement aujourd'hui."`
    }
  };

  const pressRelease = {
    en: `FOR IMMEDIATE RELEASE

Boutique Family Office Platform™ Launches Globally—Bringing Secure, AI-Powered Family Office Services to Every Country, Every Language

[City, Date]—Boutique Family Office Platform™, the industry leader in fiduciary-driven digital family office solutions, announces its global launch. Now available in Spanish, French, Portuguese, Mandarin, Arabic, and more, BFOCFO brings best-in-class wealth, health, and legal tools to families and professionals worldwide.

"Our vision is simple," said Tony Gomes, CEO. "Every family, everywhere, deserves a secure digital office that puts their needs first."

The platform features:
• Multi-language support with real-time translation
• Bank-grade security and zero-knowledge privacy
• AI-powered legacy management and planning tools
• Global compliance and regulatory support
• Secure document vault and digital inheritance

Learn more at www.my.bfocfo.com

###`,
    
    es: `PARA PUBLICACIÓN INMEDIATA

Boutique Family Office Platform™ Se Lanza Globalmente—Trayendo Servicios Seguros de Family Office Impulsados por IA a Cada País, Cada Idioma

[Ciudad, Fecha]—Boutique Family Office Platform™, líder de la industria en soluciones digitales de family office impulsadas por principios fiduciarios, anuncia su lanzamiento global. Ahora disponible en español, francés, portugués, mandarín, árabe y más, BFOCFO trae herramientas de patrimonio, salud y legales de clase mundial a familias y profesionales en todo el mundo.

"Nuestra visión es simple," dijo Tony Gomes, CEO. "Cada familia, en todas partes, merece una oficina digital segura que ponga sus necesidades primero."

La plataforma presenta:
• Soporte multiidioma con traducción en tiempo real
• Seguridad de grado bancario y privacidad de conocimiento cero
• Herramientas de gestión y planificación de legado impulsadas por IA
• Soporte de cumplimiento y regulatorio global
• Bóveda de documentos segura y herencia digital

Aprende más en www.my.bfocfo.com

###`
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            {t('campaign.materials.title')}
          </h1>
          <p className="text-muted-foreground">{t('campaign.materials.description')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Scripts
          </TabsTrigger>
          <TabsTrigger value="press" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Press Release
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                VIP Invitation Email Template
                <Badge variant="secondary">{languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name}</Badge>
              </CardTitle>
              <CardDescription>
                Personalized email template for global outreach campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject Line:</label>
                <div className="flex items-center gap-2 mt-1">
                  <Textarea 
                    value={emailTemplates[selectedLanguage as keyof typeof emailTemplates]?.subject || emailTemplates.en.subject}
                    className="resize-none"
                    rows={1}
                    readOnly
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(emailTemplates[selectedLanguage as keyof typeof emailTemplates]?.subject || emailTemplates.en.subject)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email Body:</label>
                <div className="flex items-start gap-2 mt-1">
                  <Textarea 
                    value={emailTemplates[selectedLanguage as keyof typeof emailTemplates]?.body || emailTemplates.en.body}
                    className="min-h-[200px] font-mono text-sm"
                    readOnly
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(emailTemplates[selectedLanguage as keyof typeof emailTemplates]?.body || emailTemplates.en.body)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30-Second Global Video Script</CardTitle>
              <CardDescription>
                Short-form video script for social media and ads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Textarea 
                  value={videoScripts.short[selectedLanguage as keyof typeof videoScripts.short] || videoScripts.short.en}
                  className="min-h-[200px] font-mono text-sm"
                  readOnly
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(videoScripts.short[selectedLanguage as keyof typeof videoScripts.short] || videoScripts.short.en)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="press" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Launch Press Release</CardTitle>
              <CardDescription>
                Official press release template for international media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Textarea 
                  value={pressRelease[selectedLanguage as keyof typeof pressRelease] || pressRelease.en}
                  className="min-h-[300px] font-mono text-sm"
                  readOnly
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(pressRelease[selectedLanguage as keyof typeof pressRelease] || pressRelease.en)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Announcement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value="🌍 GLOBAL LAUNCH: Every family deserves a boutique family office—now worldwide! 

Introducing BFOCFO Platform™ in your language:
🇺🇸 English | 🇪🇸 Español | 🇫🇷 Français | 🇨🇳 中文 | 🇮🇳 हिंदी | 🇸🇦 العربية

✅ Bank-grade security
✅ AI-powered legacy tools  
✅ Global compliance
✅ Your fiduciary partner

Join the movement → [link]

#FamilyOffice #WealthManagement #Global #AI #Fiduciary"
                  className="min-h-[150px] text-sm"
                  readOnly
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twitter/X Thread</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value="🧵 THREAD: Why every family needs a global family office (1/5)

The world's wealthiest families have private offices. Now everyone can.

🌍 Available in 6+ languages
🔒 Bank-grade security
🤖 AI-powered tools
⚖️ Fiduciary duty first

What this means for your family 👇

/2 Your wealth is global. Your family is international. Your legacy is borderless.

Traditional wealth management? Limited to one country, one language, one approach.

BFOCFO? Think global, act local—everywhere.

/3 Features that matter:
• Secure document vault
• Multi-generational access
• Professional advisor network
• Compliance in 50+ countries
• AI legacy planning

/4 But here's what makes us different:

Fiduciary Duty Principles™

Your interests. Always first. No conflicts. No hidden fees. No agenda except your family's success.

/5 Ready to join families from Miami to Mumbai, Madrid to Montreal?

Your global family office starts here 👇
[link]

#FamilyOffice #Wealth #Global"
                  className="min-h-[200px] text-sm"
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignMaterials;