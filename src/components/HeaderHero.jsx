import Spline from '@splinetool/react-spline'

export default function HeaderHero({ accent, fontClass }) {
  const accentHex = {
    blue: '#1E40AF',
    green: '#047857',
    mono: '#111827',
  }[accent] || '#1E40AF'

  return (
    <header className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm`}> 
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50 pointer-events-none" />
      <div className="grid lg:grid-cols-2 gap-6 items-center min-h-[320px]">
        <div className="p-6 sm:p-10 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm mb-4">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accentHex }} />
            OneShot Invoice
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold text-gray-900 ${fontClass}`}>Create a professional invoice in one shot.</h1>
          <p className="mt-3 text-gray-600 max-w-prose">
            Fill the form on the left, see a live preview on the right, and download a polished PDF instantly. No login, no history.
          </p>
        </div>
        <div className="relative h-[320px] lg:h-full">
          <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </header>
  )
}
