"use client";

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface NicoAIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConversationStep = 
  | 'ask_service'
  | 'ask_question_1'
  | 'ask_question_2'
  | 'ask_question_3'
  | 'ask_name'
  | 'ask_phone'
  | 'ask_email'
  | 'generate_ticket';

interface UserData {
  language?: string;
  service?: string;
  question1?: string;
  question2?: string;
  question3?: string;
  name?: string;
  phone?: string;
  email?: string;
  ticketNumber?: string;
}

// Language detection function
const detectLanguage = (text: string): 'es' | 'en' | 'pt' => {
  const lowerText = text.toLowerCase();
  
  // Portuguese indicators
  const ptWords = ['olá', 'oi', 'obrigado', 'obrigada', 'sim', 'não', 'por favor', 'muito', 'tudo', 'bem', 'você', 'está', 'página', 'preciso', 'gostaria', 'quero'];
  const ptCount = ptWords.filter(word => lowerText.includes(word)).length;
  
  // Spanish indicators
  const esWords = ['hola', 'gracias', 'sí', 'no', 'por favor', 'mucho', 'necesito', 'quiero', 'página', 'web', 'letrero', 'diseño'];
  const esCount = esWords.filter(word => lowerText.includes(word)).length;
  
  // English indicators
  const enWords = ['hello', 'hi', 'thanks', 'yes', 'no', 'please', 'need', 'want', 'website', 'sign', 'logo', 'design'];
  const enCount = enWords.filter(word => lowerText.includes(word)).length;
  
  // Determine language based on highest count
  if (ptCount > esCount && ptCount > enCount) return 'pt';
  if (enCount > esCount) return 'en';
  return 'es'; // Default to Spanish
};

const getInitialMessage = () => {
  return `👋 Hello! ¡Hola! Olá!

I'm Nico, how can I help you?
Soy Nico, ¿en qué puedo ayudarte?
Sou Nico, como posso ajudá-lo?`;
};

const getServiceMessage = (lang: 'es' | 'en' | 'pt') => {
  const messages = {
    es: '¿Qué servicio necesitas?\n\n1️⃣ Letrero\n2️⃣ Diseño de Logo\n3️⃣ Página Web',
    en: 'What service do you need?\n\n1️⃣ Sign\n2️⃣ Logo Design\n3️⃣ Website',
    pt: 'Qual serviço você precisa?\n\n1️⃣ Letreiro\n2️⃣ Design de Logo\n3️⃣ Site'
  };
  return messages[lang];
};

const getServiceQuestions = (service: string, questionNumber: number, lang: string) => {
  const questions = {
    letrero: {
      es: [
        '¿El letrero será para interior o exterior?',
        '¿Qué tamaño aproximado necesitas?\n\nPor ejemplo:\n• Pequeño: 12" x 24"\n• Mediano: 24" x 48"\n• Grande: 36" x 72"\n• Personalizado',
        '¿Lo quieres con luz LED o sin luz?'
      ],
      en: [
        'Will the sign be for indoor or outdoor use?',
        'What approximate size do you need?\n\nFor example:\n• Small: 12" x 24"\n• Medium: 24" x 48"\n• Large: 36" x 72"\n• Custom',
        'Do you want it with LED lighting or without light?'
      ],
      pt: [
        'O letreiro será para uso interno ou externo?',
        'Qual tamanho aproximado você precisa?\n\nPor exemplo:\n• Pequeno: 12" x 24"\n• Médio: 24" x 48"\n• Grande: 36" x 72"\n• Personalizado',
        'Você quer com iluminação LED ou sem luz?'
      ]
    },
    logo: {
      es: [
        '¿Ya tienes una idea del estilo de logo que buscas? (moderno, clásico, minimalista, etc.)',
        '¿Qué colores prefieres para tu logo?',
        '¿Cuál es el nombre de tu empresa o negocio?'
      ],
      en: [
        'Do you already have an idea of the logo style you\'re looking for? (modern, classic, minimalist, etc.)',
        'What colors do you prefer for your logo?',
        'What is the name of your company or business?'
      ],
      pt: [
        'Você já tem uma ideia do estilo de logo que procura? (moderno, clássico, minimalista, etc.)',
        'Quais cores você prefere para seu logo?',
        'Qual é o nome da sua empresa ou negócio?'
      ]
    },
    web: {
      es: [
        '¿Qué tipo de página web necesitas? (Landing page simple o página web completa con funcionalidades)',
        '¿Ya tienes contenido e imágenes preparadas o necesitas ayuda con eso?',
        '¿Necesitas la página web urgente o tienes tiempo?'
      ],
      en: [
        'What type of website do you need? (Simple landing page or full website with features)',
        'Do you already have content and images prepared or do you need help with that?',
        'Do you need the website urgently or do you have time?'
      ],
      pt: [
        'Que tipo de site você precisa? (Landing page simples ou site completo com funcionalidades)',
        'Você já tem conteúdo e imagens preparados ou precisa de ajuda com isso?',
        'Você precisa do site com urgência ou tem tempo?'
      ]
    }
  };

  const serviceKey = service === 'letrero' || service === 'sign' || service === 'letreiro' ? 'letrero' :
                     service === 'logo' || service === 'logo design' || service === 'design de logo' ? 'logo' : 'web';
  const langKey = lang === 'pt' ? 'pt' : lang === 'en' ? 'en' : 'es';
  
  return questions[serviceKey][langKey][questionNumber - 1];
};

const getServiceInfo = (service: string, lang: 'es' | 'en' | 'pt') => {
  const serviceKey = service.toLowerCase().includes('letrero') || service.toLowerCase().includes('sign') || service.toLowerCase().includes('letreiro') ? 'letrero' :
                     service.toLowerCase().includes('logo') ? 'logo' : 'web';
  
  const info = {
    letrero: {
      es: '📦 Información de Entrega:\n• Tiempo de producción: 5-7 días hábiles\n• Envío: UPS con tracking\n• Incluye: Diseño, fabricación e instalación (si es local)',
      en: '📦 Delivery Information:\n• Production time: 5-7 business days\n• Shipping: UPS with tracking\n• Includes: Design, manufacturing and installation (if local)',
      pt: '📦 Informações de Entrega:\n• Tempo de produção: 5-7 dias úteis\n• Envio: UPS com rastreamento\n• Inclui: Design, fabricação e instalação (se local)'
    },
    logo: {
      es: '🎨 Información del Servicio:\n• Entrega: 5-7 días hábiles\n• Incluye: Múltiples conceptos, revisiones ilimitadas\n• Formatos: PNG, JPG, SVG, AI\n• Archivos enviados por email',
      en: '🎨 Service Information:\n• Delivery: 5-7 business days\n• Includes: Multiple concepts, unlimited revisions\n• Formats: PNG, JPG, SVG, AI\n• Files sent by email',
      pt: '🎨 Informações do Serviço:\n• Entrega: 5-7 dias úteis\n• Inclui: Múltiplos conceitos, revisões ilimitadas\n• Formatos: PNG, JPG, SVG, AI\n• Arquivos enviados por email'
    },
    web: {
      es: '💻 Información del Proyecto:\n• Desarrollo: 5-7 días hábiles (páginas simples)\n• Incluye: Diseño responsive, hosting primer mes gratis\n• Soporte técnico incluido\n• Dominio y contenido personalizado',
      en: '💻 Project Information:\n• Development: 5-7 business days (simple pages)\n• Includes: Responsive design, first month hosting free\n• Technical support included\n• Custom domain and content',
      pt: '💻 Informações do Projeto:\n• Desenvolvimento: 5-7 dias úteis (páginas simples)\n• Inclui: Design responsivo, primeiro mês de hospedagem grátis\n• Suporte técnico incluído\n• Domínio e conteúdo personalizado'
    }
  };
  
  return info[serviceKey][lang];
};

export function NicoAIChat({ open, onOpenChange }: NicoAIChatProps) {
  const { language: contextLanguage, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<ConversationStep>('ask_service');
  const [userData, setUserData] = useState<UserData>({});
  const [chatLanguage, setChatLanguage] = useState<string>('es');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Initial greeting - ask for service directly
      addBotMessage(getInitialMessage());
    }
  }, [open]);

  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const generateTicketNumber = () => {
    return `EG${Date.now().toString().slice(-8)}`;
  };

  const saveTicketToDatabase = async (ticketData: UserData) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: ticketData.name,
          email: ticketData.email,
          phone: ticketData.phone,
          service: ticketData.service,
          details: {
            question1: ticketData.question1,
            question2: ticketData.question2,
            question3: ticketData.question3,
          },
          ticketNumber: ticketData.ticketNumber,
          language: ticketData.language,
        }),
      });

      if (!response.ok) {
        console.error('Error saving ticket');
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
  };

  const handleStepResponse = async (userResponse: string) => {
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);
      const lowerResponse = userResponse.toLowerCase();

      // Detect language from first message
      if (step === 'ask_service' && !userData.language) {
        const detectedLang = detectLanguage(userResponse);
        // Map pt to es since we only support es and en
        const supportedLang = detectedLang === 'pt' ? 'es' : detectedLang as 'es' | 'en';
        setChatLanguage(detectedLang);
        setLanguage(supportedLang);
        setUserData((prev) => ({ ...prev, language: detectedLang }));
      }

      switch (step) {
        case 'ask_service':
          let service = '';
          if (lowerResponse.includes('letrero') || lowerResponse.includes('sign') || lowerResponse.includes('letreiro') || lowerResponse === '1') {
            service = chatLanguage === 'es' ? 'letrero' : chatLanguage === 'pt' ? 'letreiro' : 'sign';
          } else if (lowerResponse.includes('logo') || lowerResponse === '2') {
            service = 'logo';
          } else if (lowerResponse.includes('web') || lowerResponse.includes('página') || lowerResponse.includes('website') || lowerResponse.includes('site') || lowerResponse === '3') {
            service = chatLanguage === 'es' ? 'página web' : chatLanguage === 'pt' ? 'site' : 'website';
          } else {
            service = userResponse;
          }
          
          setUserData((prev) => ({ ...prev, service }));
          
          const serviceLangMessages = {
            es: `Excelente elección! 👍\n\n${getServiceInfo(service, 'es')}\n\nVamos a hacer algunas preguntas sobre tu ${service}.\n\n${getServiceQuestions(service, 1, chatLanguage)}`,
            en: `Excellent choice! 👍\n\n${getServiceInfo(service, 'en')}\n\nLet's ask some questions about your ${service}.\n\n${getServiceQuestions(service, 1, chatLanguage)}`,
            pt: `Excelente escolha! 👍\n\n${getServiceInfo(service, 'pt')}\n\nVamos fazer algumas perguntas sobre seu ${service}.\n\n${getServiceQuestions(service, 1, chatLanguage)}`
          };
          
          addBotMessage(serviceLangMessages[chatLanguage as 'es' | 'en' | 'pt']);
          setStep('ask_question_1');
          break;

        case 'ask_question_1':
          setUserData((prev) => ({ ...prev, question1: userResponse }));
          addBotMessage(getServiceQuestions(userData.service || '', 2, chatLanguage));
          setStep('ask_question_2');
          break;

        case 'ask_question_2':
          setUserData((prev) => ({ ...prev, question2: userResponse }));
          addBotMessage(getServiceQuestions(userData.service || '', 3, chatLanguage));
          setStep('ask_question_3');
          break;

        case 'ask_question_3':
          setUserData((prev) => ({ ...prev, question3: userResponse }));
          const nameMessages = {
            es: '¡Perfecto! 📝 Ahora necesito tus datos para crear tu ticket de ayuda.\n\n¿Cuál es tu nombre completo?',
            en: 'Perfect! 📝 Now I need your information to create your help ticket.\n\nWhat is your full name?',
            pt: 'Perfeito! 📝 Agora preciso dos seus dados para criar seu ticket de ajuda.\n\nQual é o seu nome completo?'
          };
          addBotMessage(nameMessages[chatLanguage as 'es' | 'en' | 'pt']);
          setStep('ask_name');
          break;

        case 'ask_name':
          setUserData((prev) => ({ ...prev, name: userResponse }));
          const emailMessages = {
            es: '¿Cuál es tu correo electrónico?',
            en: 'What is your email address?',
            pt: 'Qual é o seu e-mail?'
          };
          addBotMessage(emailMessages[chatLanguage as 'es' | 'en' | 'pt']);
          setStep('ask_email');
          break;

        case 'ask_email':
          setUserData((prev) => ({ ...prev, email: userResponse }));
          const phoneMessages = {
            es: '¿Cuál es tu número de teléfono?',
            en: 'What is your phone number?',
            pt: 'Qual é o seu número de telefone?'
          };
          addBotMessage(phoneMessages[chatLanguage as 'es' | 'en' | 'pt']);
          setStep('ask_phone');
          break;

        case 'ask_phone':
          const ticketNum = generateTicketNumber();
          const finalUserData = { ...userData, phone: userResponse, ticketNumber: ticketNum };
          setUserData(finalUserData);
          
          // Save ticket to database
          await saveTicketToDatabase(finalUserData);
          
          const successMessages = {
            es: `✅ ¡Ticket creado exitosamente!\n\n📋 Número de Ticket: #${ticketNum}\n\n📝 Resumen:\n• Servicio: ${finalUserData.service}\n• Nombre: ${finalUserData.name}\n• Email: ${finalUserData.email}\n• Teléfono: ${userResponse}\n\n${getServiceInfo(finalUserData.service || '', 'es')}\n\nNuestro equipo revisará tu solicitud y se pondrá en contacto contigo dentro de las próximas 24 horas para confirmar los detalles y el proceso de pago.\n\n¡Gracias por confiar en Extreme Graphics! 🎨`,
            en: `✅ Ticket created successfully!\n\n📋 Ticket Number: #${ticketNum}\n\n📝 Summary:\n• Service: ${finalUserData.service}\n• Name: ${finalUserData.name}\n• Email: ${finalUserData.email}\n• Phone: ${userResponse}\n\n${getServiceInfo(finalUserData.service || '', 'en')}\n\nOur team will review your request and contact you within the next 24 hours to confirm details and payment process.\n\nThank you for trusting Extreme Graphics! 🎨`,
            pt: `✅ Ticket criado com sucesso!\n\n📋 Número do Ticket: #${ticketNum}\n\n📝 Resumo:\n• Serviço: ${finalUserData.service}\n• Nome: ${finalUserData.name}\n• Email: ${finalUserData.email}\n• Telefone: ${userResponse}\n\n${getServiceInfo(finalUserData.service || '', 'pt')}\n\nNossa equipe revisará sua solicitação e entrará em contato com você nas próximas 24 horas para confirmar detalhes e processo de pagamento.\n\nObrigado por confiar na Extreme Graphics! 🎨`
          };
          
          addBotMessage(successMessages[chatLanguage as 'es' | 'en' | 'pt']);
          setStep('generate_ticket');
          break;

        case 'generate_ticket':
          const helpMessages = {
            es: '¿Hay algo más en lo que pueda ayudarte? 😊',
            en: 'Is there anything else I can help you with? 😊',
            pt: 'Há algo mais em que eu possa ajudá-lo? 😊'
          };
          addBotMessage(helpMessages[chatLanguage as 'es' | 'en' | 'pt']);
          break;
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');

    handleStepResponse(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 bg-white dark:bg-slate-800 border-border">
        <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-slate-800 border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-text">Nico IA</DialogTitle>
              <div className="text-sm text-muted">
                {chatLanguage === 'es' ? 'Asistente Virtual de Ventas' : 
                 chatLanguage === 'pt' ? 'Assistente Virtual de Vendas' : 
                 'Virtual Sales Assistant'}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-800">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-text'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-muted'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white dark:bg-slate-800 border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                chatLanguage === 'es' ? 'Escribe tu mensaje...' : 
                chatLanguage === 'pt' ? 'Digite sua mensagem...' : 
                'Type your message...'
              }
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="rounded-full w-12 h-12 p-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}