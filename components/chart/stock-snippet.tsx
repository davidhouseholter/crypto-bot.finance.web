import Script from "next/script";

export default function StockSnippet({  symbol }) {
    const wrapperStyle = {
        width: "100%",
        height: "100%"
    }
    return <>
        <div id="tradingview-wrapper" style={wrapperStyle}>
            <Script
                id="tradingview-widget"
                src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
                onLoad={() => {
                    document.getElementById('tradingview-wrapper')!.appendChild(document.getElementById('tradingview-widget')!);
                }}>
                {JSON.stringify({
                    "symbol": `${symbol}`,
                    "width": "100%",
                    "height": "100%",
                    "locale": "en",
                    "dateRange": "4H",
                    "colorTheme": "light",
                    "trendLineColor": "rgba(41, 98, 255, 1)",
                    "underLineColor": "rgba(41, 98, 255, 0.3)",
                    "underLineBottomColor": "rgba(41, 98, 255, 0)",
                    "isTransparent": false,
                    "autosize": true,
                    "largeChartUrl": "",
                })}
            </Script>
        </div>
    </>
}