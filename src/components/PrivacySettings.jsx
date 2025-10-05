// src/components/PrivacySettings.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ConsentContext } from '../context/ConsentContext'
import ConsentManager from '../utils/ConsentManager'

const Row = ({ k, v }) => (
  <tr className="border-b last:border-0">
    <td className="p-2 font-mono text-xs break-all text-gray-700">{k}</td>
    <td className="p-2 font-mono text-xs break-all text-gray-600">{String(v)}</td>
  </tr>
)

const PrivacySettings = () => {
  const { consent, savePreferences, acceptAll, revokeConsent } = useContext(ConsentContext)
  const [functional, setFunctional] = useState(Boolean(consent?.categories?.functional))
  const [analytics, setAnalytics] = useState(Boolean(consent?.categories?.analytics))
  const [marketing, setMarketing] = useState(Boolean(consent?.categories?.marketing))
  const [data, setData] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const all = ConsentManager.exportAllData()
    setData(Object.entries(all))
    setLastUpdated(new Date().toISOString())
  }, [consent])

  const handleDownload = () => {
    const all = ConsentManager.exportAllData()
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    a.href = URL.createObjectURL(blob)
    a.download = `my-data-${ts}.json`
    a.click()
  }

  const handleClearAll = () => {
    if (!confirm('Delete all data stored by this app? This cannot be undone.')) return
    ConsentManager.clearAllData()
    location.reload()
  }

  const handleResetOnboarding = () => {
    if (!confirm('Reset onboarding so it will show again on next load?')) return
    try {
      const OnboardingManager = require('../utils/OnboardingManager').default
      OnboardingManager.reset()
    } catch (e) {
      localStorage.removeItem('onboardingCompleted')
      localStorage.removeItem('onboardingStep')
    }
    alert('Onboarding reset. It will appear again on next visit.')
  }

  const handleSave = () => {
    savePreferences({ functional, analytics, marketing })
  }

  const categories = useMemo(() => ([
    {
      key: 'essential',
      label: 'Essential',
      desc: 'Required for core functionality (always on)',
      value: true,
      disabled: true,
    },
    { key: 'functional', label: 'Functional', desc: 'Preferences, bookmarks, badges', value: functional, setter: setFunctional },
    { key: 'analytics', label: 'Analytics (simulated)', desc: 'Usage statistics, performance metrics', value: analytics, setter: setAnalytics },
    { key: 'marketing', label: 'Marketing (simulated)', desc: 'Social features and personalization', value: marketing, setter: setMarketing },
  ]), [functional, analytics, marketing])

  return (
<div className="min-h-screen theme-screen p-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Privacy Settings</h1>
        <p className="text-gray-600 mt-1">Manage your consent preferences and your data rights.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.key} className="p-4 border rounded-xl bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{c.label}</div>
                  <div className="text-sm text-gray-600">{c.desc}</div>
                </div>
                <label className={`inline-flex items-center ${c.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input type="checkbox" className="sr-only" checked={!!c.value} disabled={c.disabled} onChange={e => c.setter?.(e.target.checked)} />
                  <span className={`w-12 h-7 flex items-center ${c.value ? 'bg-purple-600' : 'bg-gray-300'} rounded-full p-1 transition-colors`}>
                    <span className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${c.value ? 'translate-x-5' : ''}`}></span>
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold">Save Preferences</button>
          <button onClick={acceptAll} className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 font-semibold">Accept All</button>
          <button onClick={revokeConsent} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold">Revoke Consent</button>
          <button onClick={handleResetOnboarding} className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold">Reset Onboarding</button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800">Your Data</h2>
          <p className="text-sm text-gray-600 mb-2">Below is the data currently stored in your browser for this app.</p>
          <div className="overflow-auto border rounded-xl bg-white">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-xs font-semibold text-gray-600">Key</th>
                  <th className="p-2 text-xs font-semibold text-gray-600">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map(([k, v]) => <Row key={k} k={k} v={v} />)}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleDownload} className="px-4 py-2 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold">Download My Data</button>
            <button onClick={handleClearAll} className="px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-semibold">Delete All My Data</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings
