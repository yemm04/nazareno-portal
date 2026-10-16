export default function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-full py-24">
      <div className="text-center">
        <p className="text-sm font-semibold text-amber-600 mb-2">Próximamente</p>
        <h1 className="text-2xl font-bold text-purple-950">{title}</h1>
      </div>
    </div>
  )
}