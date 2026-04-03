import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Sparkles, User, Loader2 } from 'lucide-react'
import { createSession, sendMessage } from '../services/api'
import ReactMarkdown from 'react-markdown'

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    initSession()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function initSession() {
    try {
      const session = await createSession()
      setSessionId(session.id)
      setMessages([{
        role: 'bot',
        text: "Welcome to BabyOrbit! I am your AI parenting companion.\n\nAre you **expecting a baby** or do you already have a **little one**? I am here to help with everything from pregnancy guidance to newborn care, vaccinations, and more!"
      }])
    } catch (e) {
      setMessages([{ role: 'bot', text: 'Welcome to BabyOrbit! How can I help you today?' }])
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      setMessages(prev => [...prev, { role: 'bot', text: '' }])

      await sendMessage(
        sessionId,
        userMsg,
        (partial) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'bot', text: partial }
            return updated
          })
        },
        (final) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'bot', text: final }
            return updated
          })
          setLoading(false)
        }
      )
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
      setLoading(false)
    }
  }

  const quickPrompts = [
    "My baby is 2 months old",
    "What vaccines are due?",
    "Is green poop normal?",
    "Hospital bag checklist"
  ]

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">BabyOrbit</h2>
          <p className="text-xs text-gray-500">AI Parenting Companion</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-purple-100' : 'bg-teal-100'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-purple-600" /> : <Sparkles className="w-4 h-4 text-teal-600" />}
              </div>
              <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3' : 'chat-bubble-bot px-4 py-3'}>
                {msg.text ? (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="typing-indicator flex gap-1 py-2 px-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickPrompts.map((p, i) => (
            <button key={i} onClick={() => { setInput(p); inputRef.current?.focus() }}
              className="text-xs bg-white/80 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-50 transition cursor-pointer">
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 sticky bottom-0">
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your baby, pregnancy, vaccines..."
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-400 transition"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
