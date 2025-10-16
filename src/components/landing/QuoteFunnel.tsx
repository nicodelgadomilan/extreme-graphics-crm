"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface QuoteFunnelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  indoorOutdoor: string;
  signType: string;
  lighting: string;
  size: string;
  hasLogo: string;
  logoFile?: File;
  name: string;
  phone: string;
  email: string;
  contactPreference: string;
}

export function QuoteFunnel({ open, onOpenChange }: QuoteFunnelProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    indoorOutdoor: '',
    signType: '',
    lighting: '',
    size: '',
    hasLogo: '',
    name: '',
    phone: '',
    email: '',
    contactPreference: ''
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoFile: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedTicketNumber = `EG${Date.now().toString().slice(-8)}`;
      setTicketNumber(generatedTicketNumber);

      const leadPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'wizard',
        status: 'new',
        notes: `Indoor/Outdoor: ${formData.indoorOutdoor}
Tipo: ${formData.signType}
Iluminación: ${formData.lighting}
Tamaño: ${formData.size}
Logo: ${formData.hasLogo}
Ticket: ${generatedTicketNumber}`,
        preferredContact: formData.contactPreference,
        ticketNumber: generatedTicketNumber,
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadPayload),
      });

      if (!response.ok) {
        throw new Error('Error al crear el lead');
      }

      const createdLead = await response.json();

      // Upload logo file if exists
      if (formData.logoFile) {
        try {
          const fileFormData = new FormData();
          fileFormData.append('file', formData.logoFile);
          fileFormData.append('leadId', createdLead.id.toString());

          const fileResponse = await fetch('/api/files', {
            method: 'POST',
            body: fileFormData,
          });

          if (!fileResponse.ok) {
            console.error('Error uploading file:', await fileResponse.text());
            toast.error('Lead creado pero hubo un error al subir el archivo');
          }
        } catch (fileError) {
          console.error('Error uploading file:', fileError);
          toast.error('Lead creado pero hubo un error al subir el archivo');
        }
      }

      toast.success(`¡Solicitud enviada! Tu número de ticket es: ${generatedTicketNumber}`);
      setStep(7);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Error al enviar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      indoorOutdoor: '',
      signType: '',
      lighting: '',
      size: '',
      hasLogo: '',
      name: '',
      phone: '',
      email: '',
      contactPreference: ''
    });
    setStep(1);
    setTicketNumber('');
    onOpenChange(false);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.indoorOutdoor !== '';
      case 2: return formData.signType !== '';
      case 3: return formData.lighting !== '';
      case 4: return formData.size !== '';
      case 5: return formData.hasLogo !== '' && (formData.hasLogo === 'no' || formData.logoFile);
      case 6: return formData.name && formData.phone && formData.email && formData.contactPreference;
      default: return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {language === 'es' ? 'Solicitar Presupuesto' : 'Request Quote'}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-6 space-y-6"
          >
            {/* Step 1: Indoor/Outdoor */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? '¿El letrero será para interior o exterior?' : 'Will the sign be indoor or outdoor?'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={formData.indoorOutdoor === 'indoor' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.indoorOutdoor === 'indoor' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('indoorOutdoor', 'indoor')}
                  >
                    {language === 'es' ? '🏢 Interior' : '🏢 Indoor'}
                    {formData.indoorOutdoor === 'indoor' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                  <Button
                    variant={formData.indoorOutdoor === 'outdoor' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.indoorOutdoor === 'outdoor' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('indoorOutdoor', 'outdoor')}
                  >
                    {language === 'es' ? '🌤️ Exterior' : '🌤️ Outdoor'}
                    {formData.indoorOutdoor === 'outdoor' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Sign Type */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? 'Selecciona el tipo de letrero' : 'Select sign type'}
                </h3>
                
                {/* Para Exterior - mostrar opciones Indoor/Outdoor */}
                {formData.indoorOutdoor === 'outdoor' && (
                  <div className="space-y-3">
                    <Button
                      variant={formData.signType === 'indoor_outdoor' ? 'default' : 'outline'}
                      className={`w-full h-auto py-0 text-left justify-start overflow-hidden transition-all ${
                        formData.signType === 'indoor_outdoor'
                          ? 'border-4 border-accent ring-4 ring-accent/20 scale-[1.02]'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('signType', 'indoor_outdoor')}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src="https://image.made-in-china.com/2f0j00sGLozyQFArkO/LED-Channel-Letter-Signage-with-Flush-Edge-Metal-Fabricated-Letter-Sign.jpg" 
                          alt="Indoor/Outdoor LED"
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="py-4 flex-1">
                          <div className="font-bold flex items-center gap-2">
                            {language === 'es' ? '🌤️ Indoor/Outdoor' : '🌤️ Indoor/Outdoor'}
                            {formData.signType === 'indoor_outdoor' && (
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Resistente a la intemperie' : 'Weather resistant'}
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={formData.signType === 'pvc_acrylic_outdoor' ? 'default' : 'outline'}
                      className={`w-full h-auto py-0 text-left justify-start overflow-hidden transition-all ${
                        formData.signType === 'pvc_acrylic_outdoor'
                          ? 'border-4 border-accent ring-4 ring-accent/20 scale-[1.02]'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('signType', 'pvc_acrylic_outdoor')}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src="https://i.ibb.co/1YJXT2z4/Whats-App-Image-2025-10-15-at-13-51-17.jpg" 
                          alt="PVC con cara acrílica"
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="py-4 flex-1">
                          <div className="font-bold flex items-center gap-2">
                            {language === 'es' ? 'PVC con cara acrílica' : 'PVC with Acrylic Face'}
                            {formData.signType === 'pvc_acrylic_outdoor' && (
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Para exterior, alta durabilidad' : 'For outdoor, high durability'}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                )}

                {/* Para Interior - mostrar las 3 opciones originales */}
                {formData.indoorOutdoor === 'indoor' && (
                  <div className="space-y-3">
                    <Button
                      variant={formData.signType === 'acrylic_plate' ? 'default' : 'outline'}
                      className={`w-full h-auto py-0 text-left justify-start overflow-hidden transition-all ${
                        formData.signType === 'acrylic_plate'
                          ? 'border-4 border-accent ring-4 ring-accent/20 scale-[1.02]'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('signType', 'acrylic_plate')}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src="https://i.ibb.co/VWRpvNFB/Captura-de-pantalla-2025-10-15-a-las-1-44-06-p-m.png" 
                          alt="Placa Acrílica"
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="py-4 flex-1">
                          <div className="font-bold flex items-center gap-2">
                            {language === 'es' ? 'Placa Acrílica' : 'Acrylic Plate'}
                            {formData.signType === 'acrylic_plate' && (
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Impresión UV de alta calidad' : 'High-quality UV printing'}
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={formData.signType === 'multilayer' ? 'default' : 'outline'}
                      className={`w-full h-auto py-0 text-left justify-start overflow-hidden transition-all ${
                        formData.signType === 'multilayer'
                          ? 'border-4 border-accent ring-4 ring-accent/20 scale-[1.02]'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('signType', 'multilayer')}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src="https://i.ibb.co/GvKjgDSm/Captura-de-pantalla-2025-10-15-a-las-1-45-13-p-m.png" 
                          alt="Acrílico Multicapa 3D"
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="py-4 flex-1">
                          <div className="font-bold flex items-center gap-2">
                            {language === 'es' ? 'Acrílico Multicapa 3D' : '3D Multilayer Acrylic'}
                            {formData.signType === 'multilayer' && (
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Efecto dimensional premium' : 'Premium dimensional effect'}
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={formData.signType === 'pvc_acrylic' ? 'default' : 'outline'}
                      className={`w-full h-auto py-0 text-left justify-start overflow-hidden transition-all ${
                        formData.signType === 'pvc_acrylic'
                          ? 'border-4 border-accent ring-4 ring-accent/20 scale-[1.02]'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('signType', 'pvc_acrylic')}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src="https://i.ibb.co/1YJXT2z4/Whats-App-Image-2025-10-15-at-13-51-17.jpg" 
                          alt="Letras de PVC + Acrílico"
                          className="w-24 h-24 object-cover rounded-l-lg"
                        />
                        <div className="py-4 flex-1">
                          <div className="font-bold flex items-center gap-2">
                            {language === 'es' ? 'Letras de PVC + Acrílico' : 'PVC Letters + Acrylic'}
                            {formData.signType === 'pvc_acrylic' && (
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Durabilidad y elegancia' : 'Durability and elegance'}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Lighting */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? '¿Lo quieres con luz LED?' : 'Do you want LED lighting?'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={formData.lighting === 'with_light' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.lighting === 'with_light' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('lighting', 'with_light')}
                  >
                    {language === 'es' ? '💡 Con Luz' : '💡 With Light'}
                    {formData.lighting === 'with_light' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                  <Button
                    variant={formData.lighting === 'no_light' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.lighting === 'no_light' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('lighting', 'no_light')}
                  >
                    {language === 'es' ? '⭕ Sin Luz' : '⭕ No Light'}
                    {formData.lighting === 'no_light' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Size */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? 'Selecciona el tamaño' : 'Select size'}
                </h3>
                
                {/* Para Exterior - mostrar tamaños en pies */}
                {formData.indoorOutdoor === 'outdoor' && (
                  <div className="space-y-3">
                    <Button
                      variant={formData.size === '2-5' ? 'default' : 'outline'}
                      className={`w-full h-auto py-4 text-left justify-start transition-all ${
                        formData.size === '2-5'
                          ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 border-accent'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('size', '2-5')}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-bold">{language === 'es' ? '2 a 5 pies' : '2 to 5 feet'}</div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Tamaño pequeño' : 'Small size'}
                          </div>
                        </div>
                        {formData.size === '2-5' && (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                    </Button>
                    <Button
                      variant={formData.size === '5-10' ? 'default' : 'outline'}
                      className={`w-full h-auto py-4 text-left justify-start transition-all ${
                        formData.size === '5-10'
                          ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 border-accent'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('size', '5-10')}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-bold">{language === 'es' ? '5 a 10 pies' : '5 to 10 feet'}</div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Tamaño mediano' : 'Medium size'}
                          </div>
                        </div>
                        {formData.size === '5-10' && (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                    </Button>
                    <Button
                      variant={formData.size === '10-15' ? 'default' : 'outline'}
                      className={`w-full h-auto py-4 text-left justify-start transition-all ${
                        formData.size === '10-15'
                          ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 border-accent'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => updateFormData('size', '10-15')}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-bold">{language === 'es' ? '10 a 15 pies' : '10 to 15 feet'}</div>
                          <div className="text-sm opacity-80">
                            {language === 'es' ? 'Tamaño grande' : 'Large size'}
                          </div>
                        </div>
                        {formData.size === '10-15' && (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                    </Button>
                  </div>
                )}

                {/* Para Interior - mostrar tamaños en pulgadas */}
                {formData.indoorOutdoor === 'indoor' && (
                  <div className="space-y-3">
                    {['s', 'm', 'l', 'xl', 'xxl'].map((size) => {
                      const sizeLabels = { s: '24"', m: '30"', l: '36"', xl: '48"', xxl: '60"' };
                      return (
                        <Button
                          key={size}
                          variant={formData.size === size ? 'default' : 'outline'}
                          className={`w-full h-auto py-4 text-left justify-start transition-all ${
                            formData.size === size
                              ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 border-accent'
                              : 'hover:border-accent/50'
                          }`}
                          onClick={() => updateFormData('size', size)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-bold">{size.toUpperCase()}</div>
                              <div className="text-sm opacity-80">{sizeLabels[size as keyof typeof sizeLabels]}</div>
                            </div>
                            {formData.size === size && (
                              <CheckCircle2 className="w-5 h-5" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Logo */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? '¿Tienes tu logo disponible?' : 'Do you have your logo available?'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={formData.hasLogo === 'yes' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.hasLogo === 'yes' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('hasLogo', 'yes')}
                  >
                    {language === 'es' ? '✅ Sí, tengo' : '✅ Yes, I have'}
                    {formData.hasLogo === 'yes' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                  <Button
                    variant={formData.hasLogo === 'no' ? 'default' : 'outline'}
                    className={`h-24 text-lg font-bold transition-all ${
                      formData.hasLogo === 'no' 
                        ? 'bg-accent hover:bg-accent-hover text-white ring-4 ring-accent/30 scale-105' 
                        : 'hover:border-accent/50'
                    }`}
                    onClick={() => updateFormData('hasLogo', 'no')}
                  >
                    {language === 'es' ? '❌ No tengo' : '❌ No, I don\'t'}
                    {formData.hasLogo === 'no' && (
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    )}
                  </Button>
                </div>

                {formData.hasLogo === 'yes' && (
                  <div className="mt-6 space-y-3">
                    <Label>{language === 'es' ? 'Sube tu logo' : 'Upload your logo'}</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf,.ai,.eps,.svg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {formData.logoFile ? (
                          <div className="flex items-center justify-center gap-2 text-accent">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">{formData.logoFile.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted" />
                            <p className="text-sm text-muted">
                              {language === 'es'
                                ? 'Haz clic para seleccionar o arrastra tu archivo aquí'
                                : 'Click to select or drag your file here'}
                            </p>
                            <p className="text-xs text-muted mt-1">
                              {language === 'es'
                                ? 'Formatos: PNG, JPG, PDF, AI, EPS, SVG'
                                : 'Formats: PNG, JPG, PDF, AI, EPS, SVG'}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {formData.hasLogo === 'no' && (
                  <div className="mt-6 p-6 bg-accent/10 rounded-xl border border-accent/20">
                    <h4 className="font-bold text-lg mb-2">
                      {language === 'es' ? '🎨 Diseño de Logo Profesional' : '🎨 Professional Logo Design'}
                    </h4>
                    <p className="text-sm text-muted mb-4">
                      {language === 'es'
                        ? 'Ofrecemos servicios de diseño de logo desde $150. Incluye conceptos originales, revisiones y archivos en todos los formatos.'
                        : 'We offer logo design services starting at $150. Includes original concepts, revisions, and files in all formats.'}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => window.open('/logo-design', '_blank')}>
                      {language === 'es' ? 'Ver Planes de Logo' : 'View Logo Plans'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Contact Info */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? 'Datos de contacto' : 'Contact information'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>{language === 'es' ? 'Nombre completo' : 'Full name'}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                    />
                  </div>
                  <div>
                    <Label>{language === 'es' ? 'Número de teléfono' : 'Phone number'}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+1 (786) 288-1850"
                      type="tel"
                    />
                  </div>
                  <div>
                    <Label>{language === 'es' ? 'Correo electrónico' : 'Email address'}</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="tu@email.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>{language === 'es' ? 'Canal de preferencia' : 'Preferred contact method'}</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <Button
                        variant={formData.contactPreference === 'email' ? 'default' : 'outline'}
                        className={`transition-all ${
                          formData.contactPreference === 'email'
                            ? 'bg-accent hover:bg-accent-hover text-white ring-2 ring-accent/50'
                            : 'hover:border-accent/50'
                        }`}
                        onClick={() => updateFormData('contactPreference', 'email')}
                      >
                        📧 Email
                        {formData.contactPreference === 'email' && (
                          <CheckCircle2 className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant={formData.contactPreference === 'whatsapp' ? 'default' : 'outline'}
                        className={`transition-all ${
                          formData.contactPreference === 'whatsapp'
                            ? 'bg-accent hover:bg-accent-hover text-white ring-2 ring-accent/50'
                            : 'hover:border-accent/50'
                        }`}
                        onClick={() => updateFormData('contactPreference', 'whatsapp')}
                      >
                        💬 WhatsApp
                        {formData.contactPreference === 'whatsapp' && (
                          <CheckCircle2 className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant={formData.contactPreference === 'phone' ? 'default' : 'outline'}
                        className={`transition-all ${
                          formData.contactPreference === 'phone'
                            ? 'bg-accent hover:bg-accent-hover text-white ring-2 ring-accent/50'
                            : 'hover:border-accent/50'
                        }`}
                        onClick={() => updateFormData('contactPreference', 'phone')}
                      >
                        📞 {language === 'es' ? 'Llamada' : 'Call'}
                        {formData.contactPreference === 'phone' && (
                          <CheckCircle2 className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Thank You */}
            {step === 7 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-2xl font-black">
                  {language === 'es' ? '¡Gracias por tu solicitud!' : 'Thank you for your request!'}
                </h3>
                <div className="bg-accent/10 rounded-xl p-6 inline-block">
                  <p className="text-sm text-muted mb-2">
                    {language === 'es' ? 'Número de Ticket' : 'Ticket Number'}
                  </p>
                  <p className="text-3xl font-black text-accent">#{ticketNumber}</p>
                </div>
                <p className="text-muted max-w-md mx-auto">
                  {language === 'es'
                    ? 'Nico, nuestro especialista en ventas, revisará tu solicitud y se contactará contigo dentro de las próximas 24 horas con tu presupuesto personalizado.'
                    : 'Nico, our sales specialist, will review your request and contact you within the next 24 hours with your personalized quote.'}
                </p>
                <Button onClick={handleReset} className="mt-6">
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 7 && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Atrás' : 'Back'}
            </Button>
            <Button
              onClick={step === 6 ? handleSubmit : handleNext}
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {language === 'es' ? 'Enviando...' : 'Submitting...'}
                </>
              ) : (
                <>
                  {step === 6
                    ? language === 'es' ? 'Generar Ticket' : 'Generate Ticket'
                    : language === 'es' ? 'Siguiente' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}