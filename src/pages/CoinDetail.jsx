import { useEffect, useState } from "react"
import { useNavigate, useParams,  } from "react-router-dom"
import { fetchChartData, fetchCoinData } from "../services/CoinGecko"
import { formatPrice } from "../utils/formatter"
import {CartesianGrid, LineChart, ResponsiveContainer} from "recharts"

 const CoinDetail = () => {
     
    const { id } = useParams()
    const navigate = useNavigate()
    const [coin, setCoin] = useState(null)                  
    const [chartData, setChartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {


        loadCoinData()
        loadChartData()
    }, [id])


    const loadCoinData = async () => {
         try {
              const data = await fetchCoinData(id)
              setCoin(data)
            } catch (err) {
              console.error("Error fetching crypto:", err)
            } finally {
              setIsLoading(false)
            }
    }

    const loadChartData = async () => {
         try {
              const data = await fetchChartData(id)
              const formattedData = data.prices.map((price) => ({
                time: new Date(price[0]).toLocaleDate("en-US", {
                    month: "short",
                    day: "numeric"
                }),
                price: price[1].toFixed(2),
              }))
              setChartData(formattedData)
            } catch (err) {
              console.error("Error fetching crypto:", err)
            } finally {
              setIsLoading(false)
            }
    }
    

        if(isLoading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner">
                        <p>Loading coin data</p>
                    </div>
                </div>
            </div>
        )
    }

    if(!coin) {
        return (
            <div className="app">
                <div className="no-results">
                    <p>Coin not found</p>
                </div>
                    <button onClick={() => navigate("/")} >
                        Back
                    </button>
            </div>
        )
    }

    const priceChange = coin.market_data.price_change_percentage_24h || 0
    const isPositive = priceChange >= 0
    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>🚀 Crypto Tracker</h1>
                        <p>Real-time cryptocurrency prices and market data</p>
                    </div>

                    <button onClick={() => navigate("/")} className="back-button">
                        Back
                    </button>
                </div>
            </header>

            <div className="coin-detail">
                <div className="coin-header">
                    <div className="coin-title">
                        <img src={coin.image.large} alt={coin.name} />
                        <div>
                            <h1>{coin.name}</h1>
                            <p className="symbol">{coin.symbol.toUpperCase()}</p>
                        </div>
                    </div>
                    <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
                </div>

                <div className="coin-price-section">
                    <div className="current-price">
                        <h2 className="price">
                            {formatPrice(coin.market_data.current_price.usd)}
                        </h2>
                                
                        <span className={`change-badge ${isPositive ? "positive" : "negative"}`}>
                            {Math.abs(priceChange).toFixed(2)}%
                        </span>
                    </div>
                    <div className="price-ranges">
                        <div className="price-range">
                            <span className="range-label">24h High</span>
                            <span className="range-value">{formatPrice(coin.market_data.high_24h.usd)}</span>
                        </div>
                        <div className="price-range">
                            <span className="range-label">24h Low</span>
                            <span className="range-value">{formatPrice(coin.market_data.low_24h.usd)}</span>
                        </div>
                    </div>
                </div>
                <div>

                    <div className="chart-section">
                        <h3>Price chart (7 Days)</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoinDetail