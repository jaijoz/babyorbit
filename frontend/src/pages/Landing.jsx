import { useNavigate } from 'react-router-dom'
import { Baby, Heart, Shield, Brain, Sparkles } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: <Baby className="w-8 h-8" />, title: "Newborn Care", desc: "Evidence-based guidance for feeding, sleep, and growth" },
    { icon: <Shield className="w-8 h-8" />, title: "Vaccination Tracker", desc: "WHO & IAP schedule tracking with reminders" },
    { icon: <Heart className="w-8 h-8" />, title: "Mother Wellness", desc: "Postpartum recovery, breastfeeding, mental health" },
    { icon: <Brain className="w-8 h-8" />, title: "Myth Buster", desc: "Separating fact from fiction with medical evidence" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent mb-3">
          BabyOrbit
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-xl max-w-md mx-auto">
          Your parenting universe, organized.
        </p>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-2">
          AI-powered companion from bump to baby
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-10">
        {features.map((f, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}
            className="backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="text-purple-600 mb-3">{f.icon}</div>
            <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/chat')}
        className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
      >
        Start Your Journey
      </button>

      <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-6">
        Powered by Google Gemini AI | Evidence-based guidance from WHO, AAP and CDC
      </p>
    </div>
  )
}
