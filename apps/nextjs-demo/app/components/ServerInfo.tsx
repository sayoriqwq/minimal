export default function ServerInfo({ serverSeed }: { serverSeed: number }) {
  const renderedAt = new Date().toISOString()

  return (
    <section className="w-full rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h2 className="text-lg font-semibold">RSC (Server Component)</h2>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        这块只在服务端渲染：可以安全读取服务器时间等信息，然后把数据通过 props 传给 RCC。
      </p>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-black/60 dark:text-white/60">renderedAt</dt>
          <dd className="font-mono tabular-nums">{renderedAt}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-black/60 dark:text-white/60">serverSeed</dt>
          <dd className="font-mono tabular-nums">{serverSeed}</dd>
        </div>
      </dl>
    </section>
  )
}
