import { getAssets } from '@/app/actions/assets'
import { GraficosClient } from './client'

export default async function GraficosPage() {
  const assets = await getAssets()
  const tickers = assets.map((a) => ({ name: a.name, type: a.type }))

  return <GraficosClient userAssets={tickers} />
}
