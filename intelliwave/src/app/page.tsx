"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

const webhookUrl =
  "https://intelliwaveai.app.n8n.cloud/webhook/c99b5d4e-0dec-4616-b0c0-274f8febddf6/chat";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  status?: "pending" | "error" | "done";
};

type ChatWidgetHandle = {
  open: () => void;
};

const fadeIn = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.98, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const heroHighlights = [
  "Chatbots sur mesure intégrés à vos outils",
  "Expériences conversationnelles premium",
  "Automatisations n8n invisibles & fluides",
];

const services = [
  {
    title: "Stratégie conversationnelle",
    description:
      "Nous définissons le ton, le rôle et les scénarios pour offrir des interactions utiles et mémorables.",
    icon: MessageSquare,
  },
  {
    title: "Design & identité",
    description:
      "Chaque widget est façonné pour refléter votre univers visuel, tout en restant minimaliste et chaleureux.",
    icon: Sparkles,
  },
  {
    title: "Orchestration intelligente",
    description:
      "Nous synchronisons votre chatbot avec n8n, votre CRM, vos bases de connaissances et vos APIs métiers.",
    icon: Workflow,
  },
  {
    title: "Conformité & sécurité",
    description:
      "Chiffrement, suivi des conversations et gouvernance des accès pour garantir un déploiement responsable.",
    icon: ShieldCheck,
  },
];

const process = [
  {
    title: "Immersion",
    content:
      "Audit express, capture des micro-interactions existantes et des objectifs business.",
  },
  {
    title: "Prototype vivant",
    content:
      "Nous co-concevons un parcours entièrement animé que vous testez en 48h.",
  },
  {
    title: "Industrialisation",
    content:
      "Connexion à vos outils, création des scénarios n8n et mise en production sécurisée.",
  },
  {
    title: "Optimisation continue",
    content:
      "Nous analysons les conversations et ajustons proactivement les réponses et automatisations.",
  },
];

const stats = [
  { label: "Temps de réponse moyen", value: "-63 %" },
  { label: "Satisfaction conversationnelle", value: "4,9 / 5" },
  { label: "Automatisations n8n", value: "120+" },
];

const testimonials = [
  {
    author: "Léa Martin — Directrice CX, Maison Lyra",
    quote:
      "Intelliwave a aligné notre image de marque avec un chatbot qui répond avant même que nos clientes ne posent la question. L'expérience est d'une fluidité rare.",
  },
  {
    author: "Hakim Belkacem — COO, NovaScale",
    quote:
      "Le duo n8n + Intelliwave a remplacé trois outils. Les animations donnent une impression de produit premium dès la première interaction.",
  },
];

const learnings = [
  {
    title: "Design system conversationnel",
    description:
      "Nous livrons une bibliothèque de réponses modulaires pour guider vos équipes.",
  },
  {
    title: "Connecteurs n8n prêts à l'emploi",
    description:
      "Des templates d'automatisation pour HubSpot, Notion, Slack et vos APIs internes.",
  },
  {
    title: "Pilotage par la donnée",
    description:
      "Un tableau de bord personnalisé pour suivre l'impact et les opportunités d'amélioration.",
  },
];

function FloatingBadge({
  label,
  delay,
  className,
}: {
  label: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
      }}
      transition={{
        delay,
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={cn(
        "rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/60 shadow-sm backdrop-blur",
        className
      )}
    >
      {label}
    </motion.div>
  );
}

const shimmerAnimation = {
  backgroundSize: "200% 200%",
  backgroundImage:
    "linear-gradient(120deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02), rgba(0,0,0,0.06))",
};

const ChatWidget = forwardRef<ChatWidgetHandle>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Bonjour, je suis l'assistant Intelliwave. Racontez-moi votre vision et je vous propose un parcours chatbot sur mesure.",
      status: "done",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
    }),
    []
  );

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const sendMessage = useCallback(
    async (content: string) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const optimistic: Message = {
        id,
        role: "user",
        content,
        status: "done",
      };

      const thinkingId = `${id}-thinking`;
      setMessages((prev) => [
        ...prev,
        optimistic,
        {
          id: thinkingId,
          role: "assistant",
          content: "Analyse en cours…",
          status: "pending",
        },
      ]);

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            source: "intelliwave-site",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        let replyText = "";
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
          const data = await response.json();
          replyText =
            data.reply ??
            data.output ??
            data.message ??
            JSON.stringify(data, null, 2);
        } else {
          replyText = await response.text();
        }

        if (!replyText.trim()) {
          replyText =
            "Merci ! Nous revenons vers vous très vite avec une proposition détaillée.";
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === thinkingId
              ? {
                  ...message,
                  content: replyText,
                  status: "done",
                }
              : message
          )
        );
      } catch (error) {
        console.error(error);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === thinkingId
              ? {
                  ...message,
                  content:
                    "Une légère interruption vient de se produire. Réessayez dans un instant ou contactez-nous directement sur studio@intelliwave.fr.",
                  status: "error",
                }
              : message
          )
        );
      } finally {
        setPending(false);
      }
    },
    [setMessages]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim() || pending) return;
      setPending(true);
      const value = input.trim();
      setInput("");
      void sendMessage(value);
    },
    [input, pending, sendMessage]
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-black text-white px-5 py-3 text-sm font-medium shadow-lg shadow-black/10 transition-transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
      >
        <Sparkles className="h-4 w-4" />
        {open ? "Fermer le chat" : "Discuter avec Intelliwave"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-widget"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-3xl border border-black/10 bg-white/90 shadow-2xl backdrop-blur-lg"
          >
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                Widget personnalisé
              </p>
              <p className="text-base font-semibold text-black">Intelliwave AI</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60 transition-colors hover:bg-black/10"
            >
              Échapper
            </button>
          </div>

          <div
            ref={scrollRef}
            className="gentle-grid relative max-h-[420px] space-y-4 overflow-y-auto px-5 py-6"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm transition-all",
                    message.role === "user"
                      ? "border-black/10 bg-black text-white"
                      : "border-black/5 bg-white/80 text-black backdrop-blur",
                    message.status === "pending" &&
                      "animate-pulse bg-white/60 text-black/70",
                    message.status === "error" &&
                      "border-red-300 bg-red-50 text-red-700"
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-black/5 bg-white/80 px-4 py-4 backdrop-blur"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-black/10">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="w-full border-none bg-transparent text-sm text-black placeholder:text-black/40 focus:outline-none"
                placeholder="Expliquez-nous votre projet…"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black text-white transition disabled:cursor-not-allowed disabled:bg-black/30"
                )}
                aria-label="Envoyer"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-black/40">
              Propulsé par n8n — intégration fluide & sécurisée
            </p>
          </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ChatWidget.displayName = "ChatWidget";

export default function Home() {
  const chatWidgetRef = useRef<ChatWidgetHandle | null>(null);

  const openChat = useCallback(() => {
    chatWidgetRef.current?.open();
  }, []);

  const heroText = useMemo(
    () =>
      heroHighlights.map((text, index) => (
        <motion.li
          key={text}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
          className="flex items-center gap-3 text-sm text-black/60"
        >
          <span className="h-1.5 w-8 rounded-full bg-black/20" />
          {text}
        </motion.li>
      )),
    []
  );

  return (
    <main className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-[-40%] z-0 h-[120vh] bg-[radial-gradient(circle_at_top,_rgba(18,18,18,0.16),transparent_60%)]"
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-6 py-3 text-xs uppercase tracking-[0.4em] text-black/50 shadow-sm backdrop-blur">
          <span>Intelliwave</span>
          <span>Chatbots sur mesure</span>
        </header>

        <section className="relative mt-20 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="noise relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/70 p-10 shadow-xl backdrop-blur-md lg:p-14"
            style={shimmerAnimation}
          >
            <FloatingBadge label="Agence AI" delay={0.6} className="absolute left-10 top-10" />
            <FloatingBadge label="n8n inside" delay={1.2} className="absolute right-12 top-8" />

            <div className="relative mt-16 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl"
              >
                Intelliwave façonne des chatbots qui parlent votre langage.
              </motion.h1>
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-xl text-base leading-7 text-black/60 sm:text-lg"
              >
                Nous concevons des assistants IA ultra-minimalistes, profondément liés à vos
                systèmes et pensés pour délivrer une expérience premium à chaque échange.
              </motion.p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openChat}
                  className="group flex items-center justify-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-black/90"
                >
                  Lancer le chatbot
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.button>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#processus"
                  className="flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/80 px-6 py-3 text-sm font-medium text-black/70 shadow-sm transition hover:border-black/30"
                >
                  Voir notre méthode
                  <Zap className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.aside
            variants={scaleIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.14, duration: 0.6 }}
            className="flex flex-col gap-6 rounded-[2.5rem] border border-black/10 bg-white/60 p-8 shadow-xl backdrop-blur-lg"
          >
            <ul className="space-y-5">{heroText}</ul>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-black/10 bg-white/70 px-4 py-6 text-center shadow-sm"
                >
                  <p className="text-2xl font-semibold text-black">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/45">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </section>

        <section className="mt-28 space-y-12">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/40">Services</p>
              <h2 className="mt-4 text-3xl font-semibold text-black sm:text-4xl">
                L&apos;ADN Intelliwave
              </h2>
            </div>
            <p className="max-w-xl text-sm text-black/55">
              Des équipes pluridisciplinaires (design, data, ingénierie) orchestrent votre
              chatbot de bout en bout. Chaque module est orchestré via n8n pour garantir une
              expérience sans friction.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  variants={scaleIn}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-7 shadow-lg backdrop-blur-md"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                    <div className="absolute inset-[-40%] bg-[radial-gradient(circle,_rgba(10,10,10,0.08),transparent_60%)]" />
                  </div>
                  <Icon className="relative h-6 w-6 text-black" />
                  <h3 className="relative mt-6 text-xl font-semibold text-black">
                    {service.title}
                  </h3>
                  <p className="relative mt-4 text-sm leading-6 text-black/55">
                    {service.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section
          id="processus"
          className="mt-28 rounded-[3rem] border border-black/10 bg-white/75 p-10 shadow-xl backdrop-blur-md"
        >
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/40">Processus</p>
              <h2 className="mt-4 text-3xl font-semibold text-black sm:text-4xl">
                Une méthode qui respire le détail
              </h2>
            </div>
            <p className="max-w-lg text-sm text-black/55">
              Nous alignons stratégie, design et automatisation dans un flux limpide. Chaque
              étape est rythmée par des livrables tangibles et des animations micro-interactives.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {process.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-black/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-black/5 font-semibold text-black">
                    {index + 1}
                  </span>
                  Étape
                </div>
                <h3 className="mt-6 text-xl font-semibold text-black">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/55">{step.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-28 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <motion.div
            variants={scaleIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="rounded-[3rem] border border-black/10 bg-black px-10 py-12 text-white shadow-2xl"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Résultats</p>
            <h2 className="mt-6 text-3xl font-semibold">Des expériences qui marquent</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/70">
              Nous orchestrons vos chatbots comme des produits digitaux à part entière :
              animations maîtrisées, tonalité précise, données activables et intégrations
              invisibles grâce à n8n.
            </p>

            <div className="mt-10 space-y-6">
              {testimonials.map((testimonial) => (
                <motion.blockquote
                  key={testimonial.author}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7 text-sm leading-6 text-white/80"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                >
                  “{testimonial.quote}”
                  <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">
                    {testimonial.author}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-[3rem] border border-black/10 bg-white/70 p-10 shadow-xl backdrop-blur"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-black/40">
              Ce que vous gardez
            </p>
            <h2 className="mt-6 text-3xl font-semibold text-black">
              Un écosystème conversationnel prêt à évoluer
            </h2>

            <div className="mt-10 space-y-6">
              {learnings.map((learning) => (
                <motion.div
                  key={learning.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                  className="group relative rounded-3xl border border-black/10 bg-white/80 p-7 shadow-md"
                >
                  <h3 className="text-lg font-semibold text-black">{learning.title}</h3>
                  <p className="mt-3 text-sm text-black/55">{learning.description}</p>
                  <div className="absolute inset-x-4 bottom-3 h-px origin-left scale-x-0 bg-black/10 transition-transform duration-500 group-hover:scale-x-100" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mt-28 rounded-[3rem] border border-black/10 bg-white px-10 py-14 shadow-2xl">
          <motion.div
            variants={scaleIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-black/40">Prêt à créer</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold text-black sm:text-5xl">
              Vos clients méritent un assistant qui leur ressemble.
            </h2>
            <p className="mt-6 max-w-2xl text-sm text-black/55">
              Décrivez-nous votre univers en quelques phrases et nous revenons avec un prototype
              animé, branché à votre stack via n8n.
            </p>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={openChat}
              className="mt-8 flex items-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-black/90"
            >
              Ouvrir le widget n8n
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </section>

        <footer className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-black/10 pb-10 pt-8 text-xs uppercase tracking-[0.3em] text-black/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Intelliwave Studio</p>
          <p>Paris · Remote friendly</p>
        </footer>
      </div>

      <ChatWidget ref={chatWidgetRef} />
    </main>
  );
}
