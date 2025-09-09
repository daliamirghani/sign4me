import React, { useMemo, useState, useEffect, useRef  } from "react";
import { useParams } from "react-router-dom";
import api from "./auth.api";
import { User } from "lucide-react";

import "./SignLanguageSite.css";


const LESSONS = [
  {
    id: "intro",
    title: "مقدمة إلى لغة الإشارة",
    level: "مبتدئ",
    duration: "5 دقائق",
    video: "https://www.youtube.com/embed/_A3f3Xw6QJ0",
    points: [
      "مفهوم لغة الإشارة ولماذا هي مهمة",
      "آداب التواصل مع الصم وضعاف السمع",
      "أشكال اليد الأساسية ومناطق الإشارة",
    ],
  },
  {
    id: "alphabet",
    title: "الحروف الأبجدية بالأصابع",
    level: "مبتدئ",
    duration: "10 دقائق",
    video: "https://www.youtube.com/embed/1ZVb3x9xkRc",
    points: ["أشكال اليد لكل حرف", "الانتقال بين الحروف بسلاسة", "تمارين تهجئة الأسماء"],
  },
  {
    id: "greetings",
    title: "التحيات والعبارات الشائعة",
    level: "مبتدئ",
    duration: "8 دقائق",
    video: "https://www.youtube.com/embed/3oE6nQe3n6g",
    points: ["مرحباً، صباح الخير، مساء الخير", "كيف حالك؟ شكرًا، من فضلك", "الضمائر والإشارات الإشارية للذات"],
  },
];

const LEVELS = {
  beginner: [
    {
      id: "b1",
      title: "مقدمة لغة الإشارة",
      level: "مبتدئ",
      duration: "5 دقائق",
      video: "https://www.youtube.com/embed/s_BSNVQsqrw",
      points: ["تعرف على الحروف", "تعلم الأبجدية", "إشارات التحية"],
    },
    {
      id: "b2",
      title: "إشارات يومية",
      level: "مبتدئ",
      duration: "7 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["إشارات الطعام", "الألوان", "الأرقام"],
    },
    {
      id: "b3",
      title: "محادثة بسيطة",
      level: "مبتدئ",
      duration: "8 دقائق",
      video: "https://www.youtube.com/embed/2rFh9DgE2tI",
      points: ["سؤال وجواب", "مواقف حياتية"],
    },
  ],
  intermediate: [
    {
      id: "i1",
      title: "جمل أساسية",
      level: "متوسط",
      duration: "6 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["جمل قصيرة", "الضمائر", "الأفعال"],
    },
    {
      id: "i2",
      title: "التعبير عن الوقت",
      level: "متوسط",
      duration: "9 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["الأيام", "الأشهر", "التوقيت"],
    },
    {
      id: "i3",
      title: "جمل مركبة",
      level: "متوسط",
      duration: "10 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["الصفات", "الربط بين الجمل"],
    },
  ],
  advanced: [
    {
      id: "a1",
      title: "محادثة كاملة",
      level: "محترف",
      duration: "10 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["حوار عملي", "التعبير المتقدم"],
    },
    {
      id: "a2",
      title: "مواقف متقدمة",
      level: "محترف",
      duration: "12 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["التعبير عن الرأي", "النقاشات"],
    },
    {
      id: "a3",
      title: "الطلاقة في لغة الإشارة",
      level: "محترف",
      duration: "15 دقائق",
      video: "https://www.youtube.com/embed/vNYlOCJQZbo",
      points: ["التواصل الحر", "تطبيق عملي"],
    },
  ],
};

const DICT = [
  { id: 1, arabic: "مرحبا", translit: "Marhaba", topic: "تحيات", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
  { id: 2, arabic: "شكراً", translit: "Shukran", topic: "تحيات", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
  { id: 3, arabic: "أمي", translit: "Ummi", topic: "عائلة", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
  { id: 4, arabic: "أب", translit: "Ab", topic: "عائلة", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
  { id: 5, arabic: "مدرسة", translit: "Madrasa", topic: "تعليم", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
  { id: 6, arabic: "طبيب", translit: "Tabib", topic: "مهن", video: "https://www.youtube.com/embed/g84TS0NXuIo?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" },
];

const QUIZ = [
  {
    q: "ما هي أول خطوة صحيحة عند بدء التواصل بلغة الإشارة؟",
    choices: [
      "التحدث بصوت أعلى",
      "لفت الانتباه بشكل لطيف (كلمسة على الكتف أو إشارة باليد)",
      "الاقتراب الشديد من الوجه",
      "النظر بعيداً أثناء الإشارة",
    ],
    answer: 1,
    explain: "من آداب لغة الإشارة لفت انتباه الشخص بلطف قبل البدء، والنظر إلى الوجه/الإشارات وليس إلى اليدين فقط.",
  },
  {
    q: "ما الفائدة الأساسية لتعلّم تهجئة الأصابع؟",
    choices: ["لتقوية عضلات اليد", "لتهجئة الكلمات غير المعروفة والأسماء", "لاستخدامها بدلاً من كل الإشارات", "ليست مهمة"],
    answer: 1,
    explain: "تهجئة الأصابع تُستخدم للأسماء والكلمات التي لا نعرف إشارتها أو عند الاقتباس.",
  },
];

const topics = Array.from(new Set(DICT.map((d) => d.topic)));


export function Badge({ children, tone = "default", className = "" }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

export function Button({ children, variant = "default", size = "md", className = "", ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim();
  return (
    <button {...rest} className={cls}>
      <span className="btn-inner">{children}</span>
    </button>
  );
}

export function Card({ children, className = "", onClick, onMouseMove, style, role }) {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      onMouseMove={onMouseMove}
      style={style}
      role={role}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = "" }) {
  return <div className={`card-title ${className}`}>{children}</div>;
}
export function CardDescription({ children, className = "" }) {
  return <div className={`card-description ${className}`}>{children}</div>;
}
export function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}
export function CardFooter({ children, className = "" }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}


export function useRevealOnScroll(watch) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const io = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-visible");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
        )
      : null;

    const wire = () => {
      const els = document.querySelectorAll("[data-reveal]:not(.reveal-wired)");
      els.forEach((el) => {
        el.classList.add("reveal-wired");
        if (io) io.observe(el);
        else el.classList.add("is-visible");
      });
    };

    wire();

    const mo = new MutationObserver(() => wire());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, [watch]);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return Math.min(100, Math.max(0, progress));
}


export function VideoFrame({ src, title }) {
  const [loaded, setLoaded] = useState(false);

  if (!src) return null;

  return (
    <div
      className="video-wrap"
      style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
    >
      {!loaded && (
        <div
          className="skeleton shimmer"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      <iframe
        className={`video ${loaded ? "show" : ""}`}
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}


export function AuthPage({ mode, setActive }) {
  const isSignUp = mode === "signin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const validate = () => {
    const e = {};
    if (isSignUp && !name.trim()) e.name = "الاسم مطلوب";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "بريد إلكتروني غير صالح";
    if (password.length < 6) e.password = "كلمة المرور يجب ألا تقل عن 6 أحرف";
    if (isSignUp && !agree) e.agree = "يجب الموافقة على الشروط";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const registration = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      if (isSignUp) {
        // create account 
        const res = await api.post("/signup", {
          username: name,
          email,
          password,
        });
        setMessage("تم إنشاء الحساب بنجاح");
        console.log("Signup response:", res.data);
        setActive("login");


      } else {
        // sign in
        const res = await api.post("/signin", {
          email,
          password,
        });
        setMessage("تم تسجيل الدخول بنجاح");
        console.log("Signin response:", res.data);


        setCurrentUser(res.data.username);
        localStorage.setItem("username", res.data.data.username);
        setActive("home");
      }

    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setMessage(" حصل خطأ: " + (err.response?.data?.msg || "Server error"));
    }
  };

  return (
    <section className="section" dir="rtl">
      <div className="container grid-auth">
        <Card className="rounded auth-card" data-reveal style={{ width: "150%" }}>
          <CardHeader>
            <CardTitle className="text-xl">
              {isSignUp ? "إنشاء حساب جديد (Sign up)" : "تسجيل الدخول (Log in)"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="form col gap" onSubmit={registration} noValidate>
              {isSignUp && (
                <div className={`field ${errors.name ? "has-error" : ""}`}>
                  <label className="label">الاسم الكامل</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="مثال: أحمد علي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="error">{errors.name}</div>}
                </div>
              )}

              <div className={`field ${errors.email ? "has-error" : ""}`}>
                <label className="label">البريد الإلكتروني</label>
                <input
                  className="input"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className={`field ${errors.password ? "has-error" : ""}`}>
                <label className="label">كلمة المرور</label>
                <div className="input-with-btn">
                  <input
                    className="input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded btn-icon"
                    onClick={() => setShowPass((s) => !s)} >
                    {showPass ? (
                      <img src="/eye1.png" alt="logo" width={20} />
                    ) : (
                      <img src="/eye.png" alt="logo" width={18} />
                    )}
                  </Button>
                </div>
                {errors.password && <div className="error">{errors.password}</div>}
              </div>

              {isSignUp && (
                <div className={`field row gap items-center ${errors.agree ? "has-error" : ""}`}>
                  <input
                    id="agree"
                    type="checkbox"
                    className="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label htmlFor="agree" className="small">
                    أوافق على شروط الاستخدام وسياسة الخصوصية
                  </label>
                  {errors.agree && <div className="error">{errors.agree}</div>}
                </div>
              )}

              <Button className="rounded btn-glow" type="submit">
                {isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
              </Button>
            </form>

            {message && <p className="mt-3">{message}</p>}
          </CardContent>

          <CardFooter className="muted small">
            {isSignUp
              ? "لديك حساب؟ اختر Log in من أعلى الصفحة."
              : "ليس لديك حساب؟ اختر Sign up من أعلى الصفحة."}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

export function TopNav({ active, setActive, dark, toggleDark }) {
  const currentUser = localStorage.getItem("username");

  const items = [
    { key: "home", label: "الرئيسية" },
    { key: "lessons", label: "الدروس" },
    { key: "dict", label: "القاموس" },
    { key: "quiz", label: "الاختبار" },
    { key: "practice", label: "الممارسة" },
  ];
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    alert("تم تسجيل الخروج بنجاح ✅");
    setActive("signin");
  };
  return (
    <div className="topnav">
      <div className="container flex items-center justify-between">
        <div className="brand flex items-center gap-2 cursor-pointer" onClick={() => setActive("home")}>
          <div className="logo glow">
            <img src="/hand.png" alt="logo" width={23} />
          </div>
          <span className="brand-name gradient-text">إشارة</span>
        </div>

        <nav className="nav flex gap-2">
          {items.map(({ key, label, icon }) => (
            <Button
              key={key}
              variant={active === key ? "default" : "ghost"}
              className={`rounded nav-link ${active === key ? "active" : ""}`}
              onClick={() => setActive(key)}
            >
              <span className="nav-icon">{icon}</span> {label}
            </Button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* sign up button*/}
          <Button
            variant={active === "signin" ? "default" : "outline"}
            className="rounded"
            onClick={() => setActive("signin")}
          >
            Sign up
          </Button>
          {/* sign out button*/}
          <Button
            variant="outline"
            className="rounded"
            onClick={signOut}
          >
            Sign out
          </Button>
          {/* login button*/}
          <Button
            variant={active === "login" ? "default" : "outline"}
            className="rounded"
            onClick={() => setActive("login")}
          >
            Log in
          </Button>
        {/* dark/light mode button*/}
          <Button
            variant="outline"
            className="rounded"
            onClick={toggleDark}
            aria-label="تبديل الوضع الداكن"
            title="تبديل الوضع"
            style={{ transform: "translate(-90px,0px)", marginRight: 20 }}
          >
            {dark
              ? <img src="/sun.png" alt="" width={17} />
              : <img src="/crescent-moon.png" alt="" width={17} />}
          </Button>

          {/* User info */}

          {currentUser && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full shadow-sm w-max">
              <User
                size={28}
                color="#1F2937"
                className="rounded-full bg-white p-1"
                variant="outline"
                style={{ marginRight: -80 }}
              />
              <span className="text-gray-800 font-medium">{currentUser}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}


export function SignBanner() {
  const PHRASE = "لغة الإشارة جسر للتواصل مع الصم";
  return (
    <div className="sign-banner" data-reveal aria-label={PHRASE}>
      <div className="logo glow">
        <img src="/hand.png" alt="logo" width={23}/>
      </div>
      <div className="sign-phrase">
        {PHRASE.split(" ").map((word, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.3}s`, display: "inline-block", marginRight: "0.25em" }}>
            {word}
          </span>
        ))}

      </div>
      <div className="sign-hands">
        <span className="hand"><img src="/ok.png" alt="logo" width={23}/></span>
        <span className="hand"><img src="/letter-i.png" alt="logo" width={23}/></span>
        <span className="hand"><img src="/letter-v.png" alt="logo" width={23}/></span>
      </div>
    </div>
  );
}

export function Hero({ goLessons }) {
  return (
    <section className="section" dir="rtl">
      <div className="container grid-2">
        <div data-reveal>
          <h1 className="hero-title gradient-text">تعلّم لغة الإشارة العربية بسهولة وبطريقة ممتعة</h1>
          <p className="muted mt-4 text-lg">دروس قصيرة، قاموس مرئي، واختبارات تفاعلية — كل ذلك في مكان واحد.</p>
          <div className="row gap mt-6">
            <Button size="lg" className="rounded btn-glow" onClick={goLessons}>
              ابدأ الآن
            </Button>
          </div>
          <div className="row gap mt-6 small muted" data-reveal>
             دروس فيديو •  تمارين قصيرة •  قاموس مرئي
          </div>
        </div>

        <div data-reveal className="delay">
          <div className="hero-video">
            <VideoFrame src="https://www.youtube.com/embed/JtVf-jaf4ko" title="Intro" />
            <div className="badge-floating"></div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function Lessons() {
  const [level, setLevel] = useState(null);
  const [unlocked, setUnlocked] = useState({});
  const [current, setCurrent] = useState(null);

  const active = useMemo(() => {
    if (!level || !current) return null;
    return LEVELS[level].find((l) => l.id === current);
  }, [level, current]);

  const finishLesson = () => {
    const lessons = LEVELS[level];
    const idx = lessons.findIndex((l) => l.id === current);
    if (idx < lessons.length - 1) {
      const nextId = lessons[idx + 1].id;
      setUnlocked((prev) => ({ ...prev, [nextId]: true }));
      setCurrent(nextId);
    }
  };

  const goToNextLevel = () => {
    if (level === "beginner") {
      setLevel("intermediate");
      setUnlocked({ i1: true });
      setCurrent("i1");
    } else if (level === "intermediate") {
      setLevel("advanced");
      setUnlocked({ a1: true });
      setCurrent("a1");
    }
  };

  if (!level) {
  
    return (
      <section
        className="section"
        style={{
          marginBottom: "265px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(100px)",
        }}
      >
        <h2 style={{ fontSize: "30px", marginBottom: "20px" }}>اختر مستواك</h2>
        <div className="row gap" style={{ justifyContent: "center", gap: "20px" }}>
          <Button onClick={() => setLevel("beginner")}>مبتدئ</Button>
          <Button onClick={() => setLevel("intermediate")}>متوسط</Button>
          <Button onClick={() => setLevel("advanced")}>محترف</Button>
        </div>
      </section>
    );
  }
  const lessons = LEVELS[level];
  const isLastLesson = current === lessons[lessons.length - 1].id;

  return (
    <section className="section" dir="rtl">
      <div className="container grid-2 gap-6"style={{gap: "20px"}}>
        <div className="flex flex-col gap-4" style={{gap: "30px"}}>
          {lessons.map((l) => {
            const locked = !unlocked[l.id];
            return (
              <Card
                key={l.id}
                className={`clickable ${current === l.id ? "ring" : ""} ${
                  locked ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!locked) setCurrent(l.id);
                }}
                style={{marginBottom: "20px"}}
              >
                <CardHeader>
                  <CardTitle className="row gap">
                    <span>{locked ? <img src="/lock-padlock-symbol-for-security-interface.png" alt="logo" width={23}/> : <img src="/eye.png" alt="logo" width={23}/>}</span>
                    <span>{l.title}</span>
                  </CardTitle>
                  <CardDescription>
                    <Badge>{l.level}</Badge> • {l.duration}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div>
          {active && (
            <Card className="rounded">
              <CardHeader>
                <CardTitle className="text-xl">{active.title}</CardTitle>
                <CardDescription>
                  المستوى: {active.level} • المدة: {active.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y">
                <VideoFrame src={active.video} title={active.title} />
                <ul className="list-disc pl-6">
                  {active.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <div className="row gap mt-4">
                  {!isLastLesson ? (
                    <Button onClick={finishLesson}>إنهاء الدرس</Button>
                  ) : level !== "advanced" ? (
                    <Button onClick={goToNextLevel}>
                       الانتقال إلى المستوى التالي
                    </Button>
                  ) : (
                    <span className="font-bold text-green-600">
                       مبروك! أنهيت جميع المستويات
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}


export function Dictionary() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("الكل");
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favSigns") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("favSigns", JSON.stringify(favs)), [favs]);

  const data = useMemo(() => {
    const t = tag === "الكل" ? DICT : DICT.filter((d) => d.topic === tag);
    if (!q.trim()) return t;
    const s = q.trim().toLowerCase();
    return t.filter((d) => d.arabic.includes(q) || (d.translit || "").toLowerCase().includes(s));
  }, [q, tag]);

  const toggleFav = (id, word) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setToast(next.includes(id) ? `تمت إضافة "${word}" إلى المفضلة` : `تمت إزالة "${word}" من المفضلة`);
      setTimeout(() => setToast(""), 1500);
      return next;
    });
  };

  return (
    <section className="section" dir="rtl">
      <Card className="rounded" data-reveal>
        <CardHeader className="pb-0">
          <CardTitle className="row gap"> القاموس المرئي</CardTitle>
          <CardDescription>ابحث عن الإشارة حسب الكلمة أو المجال</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="row wrap gap">
            <div className="input-wrap">
              <span className="input-icon"><img src="/search.png" alt="logo" width={20}/></span>
              <input
                dir="rtl"
                placeholder="ابحث عن كلمة..."
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="row gap overflow chips">
              <Button size="sm" variant={tag === "الكل" ? "default" : "outline"} className="rounded chip" onClick={() => setTag("الكل")}>الكل</Button>
              {topics.map((t) => (
                <Button key={t} size="sm" variant={tag === t ? "default" : "outline"} className="rounded chip" onClick={() => setTag(t)}>
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="cards-grid" style={{marginTop: "20px"}}>
            {data.map((item) => (
              <Card key={item.id} className="rounded column" data-reveal>
                <CardHeader className="pb-0">
                  <div className="row between">
                    <CardTitle className="text-lg">{item.arabic}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`rounded btn-icon fav-toggle ${favs.includes(item.id) ? "is-fav" : ""}`}
                      onClick={() => toggleFav(item.id, item.arabic)}
                      ariaLabel="تبديل المفضلة"
                      title={favs.includes(item.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    >
                      {favs.includes(item.id) ? "★" : "☆"}
                    </Button>
                  </div>
                  <CardDescription>{item.translit} • {item.topic}</CardDescription>
                </CardHeader>
                <CardContent className="grow">
                  <VideoFrame src={item.video} title={item.arabic} />
                </CardContent>
              </Card>
            ))}
          </div>

          {data.length === 0 && <div className="center muted py-10">لا توجد نتائج مطابقة لبحثك.</div>}
        </CardContent>
      </Card>

      {toast && <div className="toast show">{toast}</div>}
    </section>
  );
}


export function Quiz() {
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [level, setLevel] = useState(null); // beginner/intermediate/advanced

 
  const urlMap = {
    beginner: "http://localhost:5000/quiz/showSigns/1",
    intermediate: "http://localhost:5000/quiz/showSigns/2",
    advanced: "http://localhost:5000/quiz/showSigns/3",
  };

 
  useEffect(() => {
    if (!level) return;

    let isCancelled = false;
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(urlMap[level]);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (!isCancelled) {
          const transformed = data.quiz.map(q => {
            const answerIndex = q.choices.indexOf(q.answer);
            return {
              q: q.question,
              choices: q.choices,
              answer: Math.max(0, answerIndex),
            };
          });
          setQuiz(transformed);
          setLoading(false);
          setIndex(0);
          setSelected(null);
          setScore(0);
          setDone(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Quiz loading error:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadQuiz();
    return () => { isCancelled = true; };
  }, [level]);

  if (!level) {
    // LEVEL SELECTION SCREEN
    return (
      <section
        className="section"
        style={{
          marginBottom: "265px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(100px)",
        }}
      >
        <h2 style={{ fontSize: "30px", marginBottom: "20px" }}>اختر مستواك</h2>
        <div className="row gap" style={{ justifyContent: "center", gap: "20px" }}>
          <Button onClick={() => setLevel("beginner")}>مبتدئ</Button>
          <Button onClick={() => setLevel("intermediate")}>متوسط</Button>
          <Button onClick={() => setLevel("advanced")}>محترف</Button>
        </div>
      </section>
    );
  }

  // QUIZ DISPLAY
  if (loading) return <p>Loading your quiz...</p>;
  if (error) return <p>Error loading quiz: {error}</p>;
  if (quiz.length === 0) return <p>No quiz questions available.</p>;

  const q = quiz[index];
  if (!q) return <p>Quiz data error.</p>;

  const submit = () => {
    if (selected === null) return;
    if (selected === q.answer) setScore((s) => s + 1);
    if (index + 1 < quiz.length) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <section className="section" dir="rtl">
      <Card className="rounded narrow" data-reveal>
        <CardHeader>
          <CardTitle className="row gap">اختبار قصير</CardTitle>
          <CardDescription>أسئلة اختيار من متعدد لمراجعة الأساسيات</CardDescription>
        </CardHeader>
        <CardContent>
          {!done ? (
            <div className="col gap">
              <div className="q-title">{q.q}</div>
              <div className="col gap">
                {q.choices.map((c, i) => (
                  <Button
                    key={i}
                    variant={selected === i ? "default" : "outline"}
                    className="rounded left hover-move"
                    onClick={() => setSelected(i)}
                  >
                    <span style={{ marginRight: "5px" }}>{String.fromCharCode(0x0661 + i)}.</span>
                    <img
                      src={c}
                      alt={`choice ${i}`}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  </Button>
                ))}
              </div>
              <div className="row gap">
                <Button className="rounded btn-glow" onClick={submit} disabled={selected === null}>
                  تأكيد الإجابة
                </Button>
              </div>
              <div className="muted small">سؤال {index + 1} من {quiz.length}</div>
            </div>
          ) : (
            <div className="center col gap">
              <div className="score pop">نتيجتك: {score} / {quiz.length}</div>
              <div className="muted">أحسنت! تابع التعلّم عبر الدروس والقاموس.</div>
              <Button className="rounded" onClick={restart}>إعادة الاختبار</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}


export function Practice() {
  const [note, setNote] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard?.writeText(note); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };
    if (showCamera) {
    return <CameraPractice onBack={() => setShowCamera(false)} />; // لو ضغط الزرار نروح للكاميرا
  }
  return (
    <section className="section" dir="rtl">
      <div className="container grid-2-60">
        <Card className="rounded" data-reveal>
          <CardHeader>
            
            <CardDescription>سجل ملاحظاتك</CardDescription>
          </CardHeader>
          <CardContent className="col gap">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ما تعلّمته اليوم، الكلمات الجديدة، أو ملاحظات حول حركة اليد..."
              className="textarea"
            />
            <div className="row gap">
              <Button className="rounded" onClick={() => setNote("")}>مسح</Button>
              <Button variant="outline" className="rounded" onClick={copy}>{copied ? "✓ تم النسخ" : "نسخ"}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded" data-reveal>
          <CardHeader>
            <CardTitle className="row gap"> تدريب باستخدام فيديو</CardTitle>
            <CardDescription>شغّل فيديو تعليمي وقلّده أمام المرآة أو الكاميرا</CardDescription>
          </CardHeader>
          <CardContent className="col gap">
            <VideoFrame src="https://www.youtube.com/embed/zm8NORWwqYY?list=PLbDJL_fJwCrD3WAqwdtO7qzkK3pyhTIJP" title="Practice" />
            
            <div className="row gap items-center">
              <input
                id="consent"
                type="checkbox"
                className="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <label htmlFor="consent" className="small">أوافق على استخدام الكاميرا للتجارب التعليمية على جهازي فقط</label>
            </div>
            <div className="grid-2 gap">
              <Button disabled={!accepted} className="rounded" style={{width: "210%"}} onClick={() => setShowCamera(true)} >فتح الكاميرا</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function CameraPractice({ onBack }) {
  const [streaming, setStreaming] = useState(false);
  const [translation, setTranslation] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // إرسال Frame للباك إند كل 3 ثواني
  useEffect(() => {
    if (!streaming) return;

    const interval = setInterval(async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 64, 64);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const res = await fetch("http://localhost:8000/predict", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          setTranslation((prev) => prev + data.letter);
        } catch (err) {
          console.error("Prediction error:", err);
        }
      }, "image/jpeg");
    }, 3000);

    return () => clearInterval(interval);
  }, [streaming]);

  return (
    <section className="section" dir="rtl">
      <div className="container grid-2-60">

        {/* الكاميرا */}
        <Card className="rounded" data-reveal>
          <CardHeader>
            <CardTitle className="row gap">تدريب بالكاميرا</CardTitle>
            <CardDescription>فعّل الكاميرا وابدأ الترجمة</CardDescription>
          </CardHeader>
          <CardContent className="col gap">
            <video ref={videoRef} autoPlay playsInline className="rounded" style={{ width: "100%" }} />
            <canvas ref={canvasRef} width="64" height="64" style={{ display: "none" }} />
            <div className="row gap">
              <Button className="rounded" onClick={startCamera}>
                فتح الكاميرا
              </Button>
              <Button variant="outline" className="rounded" onClick={onBack}>
                ⬅ رجوع
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* النتيجة */}
        <Card className="rounded" data-reveal>
          <CardHeader>
            <CardTitle>نتيجة الترجمة</CardTitle>
            <CardDescription>الحروف المستخرجة من لغة الإشارة</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={translation}
              readOnly
              className="textarea"
              placeholder="هنا هتظهر الحروف المترجمة..."
              style={{ minHeight: "200px" }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section className="section" dir="rtl">
      <Card className="rounded narrow" data-reveal>
        <CardHeader>
          <CardTitle>عن الموقع</CardTitle>
          <CardDescription>مشروع تعليمي مفتوح المصدر لتسهيل تعلّم لغة الإشارة العربية</CardDescription>
        </CardHeader>
        <CardContent className="lead">
          <p>يهدف هذا الموقع إلى توفير بوابة مبسطة لتعلّم أساسيات لغة الإشارة: دروس قصيرة، قاموس مرئي، واختبارات سريعة. يمكنك تعديل المحتوى والروابط بما يلائم جمهورك.</p>
          <ul className="list">
            <li>تصميم متجاوب وسهل الاستخدام</li>
            <li>دعم الوضع الداكن واللغة العربية (RTL)</li>
            <li>إمكانية إضافة وحدات جديدة بسهولة</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}


export function Home({ goLessons }) {
  return (
    <>
      <SignBanner />
      <Hero goLessons={goLessons} />
    </>
  );
}

export default function SignLanguageSite() {
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(false);
  const progress = useScrollProgress();
  useRevealOnScroll(active);

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const [showFAB, setShowFAB] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowFAB(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <TopNav active={active} setActive={setActive} dark={dark} toggleDark={() => setDark((d) => !d)} />

      {active === "home" && <Home goLessons={() => setActive("lessons")} />}
      {active === "lessons" && <Lessons />}
      {active === "dict" && <Dictionary />}
      {active === "quiz" && <Quiz />}
      {active === "practice" && <Practice />}
      {active === "about" && <About />}
      {active === "signin" && <AuthPage mode="signin" setActive={setActive} />}
      {active === "login" && <AuthPage mode="login" setActive={setActive} />}

      {showFAB && (
        <button
          className="fab"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة للأعلى"
          title="العودة للأعلى"
        >
          ↑
        </button>
      )}

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/hand.png" alt="Logo" className="footer-logo" />
            <span className="footer-title">إشارة</span>
          </div>

          <nav className="footer-nav">
            <a href="#">الرئيسية</a>
            <a href="#">الدروس</a>
            <a href="#">الخصوصية</a>
          </nav>

          <div className="footer-social" style={{ display: "flex", gap: "20px" }}>
            <a href="#"><img src="/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="/youtube.png" alt="YouTube" /></a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} إشارة — تعلم لغة الإشارة العربية</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ↑ العودة للأعلى
          </a>
        </div>
      </footer>
    </div>
  );
}
