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
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Your parenting universe, organized.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          AI-powered companion from bump to baby
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-10">
        {features.map((f, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-white/50">
            <div className="text-purple-600 mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/chat')}
        className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
      >
        Start Your Journey
      </button>

      <p className="text-xs text-gray-400 mt-6">
        Powered by Google Gemini AI | Evidence-based guidance from WHO, AAP and CDC
      </p>
    </div>
  )
}
